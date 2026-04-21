import express from 'express';
import mongoose from 'mongoose';
import {
    createSudokuGame,
    deleteSudokuGameById,
    findAllSudokuGames,
    findSudokuGameByName,
    findSudokuGameById,
} from './db/model/sudoku.model.js';
import { deleteHighscoresByGameId, findHighscoreByUserAndGame } from './db/model/highscore.model.js';
import {
    findGameProgressByUserAndGame,
    upsertGameProgressByUserAndGame,
    deleteGameProgressByGameId,
} from './db/model/gameProgress.model.js';
import { generateGameBoards, generateGameName } from '../utils.js';

const router = express.Router();

function requireAuth(req, res) {
    if (!req.cookies.userId || !req.cookies.username) {
        res.status(401).json({ error: 'You must be logged in to modify games' });
        return false;
    }
    return true;
}

function normalizeDifficulty(value) {
    const difficulty = String(value || '').toUpperCase();
    return difficulty === 'EASY' || difficulty === 'NORMAL' ? difficulty : null;
}

async function createUniqueGameName() {
    for (let attempt = 0; attempt < 20; attempt += 1) {
        const name = generateGameName();
        const existingGame = await findSudokuGameByName(name);
        if (!existingGame) return name;
    }

    return `${generateGameName()} ${Date.now()}`;
}

router.get('/', async function (req, res) {
    try {
        const games = await findAllSudokuGames();
        return res.json({ games });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to load Sudoku games' });
    }
});

router.post('/', async function (req, res) {
    try {
        if (!requireAuth(req, res)) return;

        const difficulty = normalizeDifficulty(req.body.difficulty);
        if (!difficulty) {
            return res.status(400).json({ error: 'Difficulty must be EASY or NORMAL' });
        }

        const boards = generateGameBoards(difficulty);
        const game = await createSudokuGame({
            name: await createUniqueGameName(),
            difficulty,
            createdBy: req.cookies.userId || null,
            createdByUsername: req.cookies.username || 'Anonymous',
            ...boards,
        });

        return res.status(201).json({ gameId: game._id.toString(), game });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create Sudoku game' });
    }
});

router.get('/:gameId', async function (req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.gameId)) {
            return res.status(400).json({ error: 'Invalid game ID' });
        }

        const game = await findSudokuGameById(req.params.gameId);
        if (!game) {
            return res.status(404).json({ error: 'Sudoku game was not found' });
        }

        if (!req.cookies.userId) {
            return res.json({
                game,
                completed: false,
                userCompletionSeconds: null,
                userBoard: game.puzzle,
                userSeconds: 0,
            });
        }

        const [highscoreEntry, progress] = await Promise.all([
            findHighscoreByUserAndGame(req.cookies.userId, req.params.gameId),
            findGameProgressByUserAndGame(req.cookies.userId, req.params.gameId),
        ]);

        const completed = Boolean(highscoreEntry?.gameId) || Boolean(progress?.completed);
        const userCompletionSeconds = completed
            ? Number.isFinite(highscoreEntry?.completionSeconds)
                ? highscoreEntry.completionSeconds
                : Number.isFinite(progress?.seconds)
                    ? progress.seconds
                    : 0
            : null;

        const effectiveProgress =
            progress ||
            (await upsertGameProgressByUserAndGame(
                req.cookies.userId,
                req.params.gameId,
                {},
                {
                    currentBoard: game.puzzle.map((row) => row.slice()),
                    seconds: 0,
                    completed: false,
                }
            ));

        return res.json({
            game,
            completed,
            userCompletionSeconds,
            userBoard:
                completed && Array.isArray(effectiveProgress?.currentBoard)
                    ? effectiveProgress.currentBoard
                    : completed
                        ? game.solution
                        : effectiveProgress.currentBoard,
            userSeconds: completed
                ? userCompletionSeconds ?? 0
                : Number.isFinite(effectiveProgress.seconds)
                    ? effectiveProgress.seconds
                    : 0,
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to load Sudoku game' });
    }
});

router.put('/:gameId', async function (req, res) {
    try {
        if (!requireAuth(req, res)) return;

        if (!mongoose.isValidObjectId(req.params.gameId)) {
            return res.status(400).json({ error: 'Invalid game ID' });
        }

        const game = await findSudokuGameById(req.params.gameId);
        if (!game) {
            return res.status(404).json({ error: 'Sudoku game was not found' });
        }

        const existingProgress = await findGameProgressByUserAndGame(
            req.cookies.userId,
            req.params.gameId
        );
        if (existingProgress?.completed) {
            return res.status(403).json({ error: 'Completed games cannot be modified' });
        }

        const updates = {};
        if (Array.isArray(req.body.currentBoard)) {
            updates.currentBoard = req.body.currentBoard;
        }
        if (Number.isFinite(req.body.seconds)) {
            updates.seconds = Math.max(0, Math.floor(req.body.seconds));
        }
        if (req.body.reset === true) {
            updates.currentBoard = game.puzzle.map((row) => row.slice());
            updates.seconds = 0;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No valid fields provided for update' });
        }

        const progress = await upsertGameProgressByUserAndGame(
            req.cookies.userId,
            req.params.gameId,
            updates,
            {
                currentBoard: game.puzzle.map((row) => row.slice()),
                seconds: 0,
                completed: false,
            }
        );

        return res.json({ progress });
    } catch (error) {
        console.error('PUT /api/sudoku/:gameId failed', {
            gameId: req.params.gameId,
            userId: req.cookies?.userId,
            bodyKeys: Object.keys(req.body || {}),
            error,
        });
        return res.status(500).json({
            error: 'Failed to update Sudoku game',
            details: error?.message || String(error),
        });
    }
});

router.delete('/:gameId', async function (req, res) {
    try {
        if (!requireAuth(req, res)) return;

        if (!mongoose.isValidObjectId(req.params.gameId)) {
            return res.status(400).json({ error: 'Invalid game ID' });
        }

        const game = await findSudokuGameById(req.params.gameId);
        if (!game) {
            return res.status(404).json({ error: 'Sudoku game was not found' });
        }
        if (!game.createdBy || game.createdBy.toString() !== req.cookies.userId) {
            return res.status(403).json({ error: 'Only the creator can delete this game' });
        }

        await deleteSudokuGameById(req.params.gameId);

        await deleteHighscoresByGameId(req.params.gameId);
        await deleteGameProgressByGameId(req.params.gameId);
        return res.json({ ok: true });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete Sudoku game' });
    }
});

export default router;

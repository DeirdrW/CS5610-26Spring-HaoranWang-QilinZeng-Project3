import express from 'express';
import mongoose from 'mongoose';
import {
    createHighscore,
    findHighscores,
    findHighscoresByGameId,
} from './db/model/highscore.model.js';
import { findSudokuGameById, updateSudokuGameById } from './db/model/sudoku.model.js';
import { upsertGameProgressByUserAndGame } from './db/model/gameProgress.model.js';

const router = express.Router();

router.get('/', async function (req, res) {
    try {
        const highscores = await findHighscores();
        return res.json({ highscores });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to load highscores' });
    }
});

router.post('/', async function (req, res) {
    try {
        const { gameId, completionSeconds, currentBoard } = req.body;
        if (!req.cookies.userId || !req.cookies.username) {
            return res.status(401).json({ error: 'You must be logged in to submit a highscore' });
        }
        if (!mongoose.isValidObjectId(gameId)) {
            return res.status(400).json({ error: 'Invalid game ID' });
        }
        const safeCompletionSeconds = Number.isFinite(completionSeconds)
            ? Math.max(0, Math.floor(completionSeconds))
            : 0;
        const safeCurrentBoard = Array.isArray(currentBoard) ? currentBoard : null;

        const game = await findSudokuGameById(gameId);
        if (!game) {
            return res.status(404).json({ error: 'Sudoku game was not found' });
        }

        const alreadyCompleted = game.completedBy.some(
            (userId) => userId.toString() === req.cookies.userId
        );
        if (!alreadyCompleted) {
            await updateSudokuGameById(gameId, {
                completedBy: [...game.completedBy, req.cookies.userId],
            });
        }

        try {
            const highscore = await createHighscore({
                userId: req.cookies.userId,
                username: req.cookies.username,
                gameId,
                completionSeconds: safeCompletionSeconds,
            });
            await upsertGameProgressByUserAndGame(
                req.cookies.userId,
                gameId,
                {
                    completed: true,
                    currentBoard: safeCurrentBoard || game.solution.map((row) => row.slice()),
                    seconds: safeCompletionSeconds,
                },
                {
                    completed: true,
                    currentBoard: safeCurrentBoard || game.solution.map((row) => row.slice()),
                    seconds: safeCompletionSeconds,
                }
            );
            return res.status(201).json({ highscore });
        } catch (error) {
            if (error.code === 11000) {
                await upsertGameProgressByUserAndGame(
                    req.cookies.userId,
                    gameId,
                    {
                        completed: true,
                        currentBoard: safeCurrentBoard || game.solution.map((row) => row.slice()),
                    },
                    {
                        completed: true,
                        currentBoard: safeCurrentBoard || game.solution.map((row) => row.slice()),
                        seconds: safeCompletionSeconds,
                    }
                );
                return res.status(200).json({ ok: true, message: 'Highscore already recorded' });
            }
            throw error;
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to create highscore' });
    }
});

router.get('/:gameId', async function (req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.gameId)) {
            return res.status(400).json({ error: 'Invalid game ID' });
        }

        const highscores = await findHighscoresByGameId(req.params.gameId);
        return res.json({ gameId: req.params.gameId, highscores });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to load game highscores' });
    }
});

export default router;

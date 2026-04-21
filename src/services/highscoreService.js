import client from './client';

export async function listHighscores() {
    const response = await client.get('/highscore');
    return response.data.highscores;
}

export async function submitHighscore(gameId, completionSeconds, currentBoard) {
    const response = await client.post('/highscore', { gameId, completionSeconds, currentBoard });
    return response.data;
}

export async function getGameHighscores(gameId) {
    const response = await client.get(`/highscore/${gameId}`);
    return response.data.highscores;
}

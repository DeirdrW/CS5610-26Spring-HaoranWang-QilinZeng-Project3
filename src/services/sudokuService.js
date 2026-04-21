import client from './client';

export async function listSudokuGames() {
    const response = await client.get('/sudoku');
    return response.data.games;
}

export async function createSudokuGame(difficulty) {
    const response = await client.post('/sudoku', { difficulty });
    return response.data;
}

export async function getSudokuGame(gameId) {
    const response = await client.get(`/sudoku/${gameId}`);
    return response.data;
}

export async function updateSudokuGame(gameId, updates) {
    const response = await client.put(`/sudoku/${gameId}`, updates);
    return response.data.progress;
}

export async function deleteSudokuGame(gameId) {
    const response = await client.delete(`/sudoku/${gameId}`);
    return response.data;
}

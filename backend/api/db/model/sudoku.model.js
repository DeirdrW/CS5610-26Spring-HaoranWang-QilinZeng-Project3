import mongoose from 'mongoose';
import SudokuSchema from '../schema/sudoku.schema.js';

const SudokuModel = mongoose.model('Sudoku', SudokuSchema);

export function createSudokuGame(game) {
    return SudokuModel.create(game);
}

export function findAllSudokuGames() {
    return SudokuModel.find()
        .select('name difficulty createdByUsername createdAt updatedAt')
        .sort({ createdAt: -1 })
        .exec();
}

export function findSudokuGameById(gameId) {
    return SudokuModel.findById(gameId).exec();
}

export function findSudokuGameByName(name) {
    return SudokuModel.findOne({ name }).select('_id').lean().exec();
}

export function updateSudokuGameById(gameId, updates) {
    return SudokuModel.findByIdAndUpdate(gameId, updates, {
        new: true,
        runValidators: true,
    }).exec();
}

export function deleteSudokuGameById(gameId) {
    return SudokuModel.findByIdAndDelete(gameId).exec();
}

export default SudokuModel;

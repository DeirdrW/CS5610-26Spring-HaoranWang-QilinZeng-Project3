import { Schema } from 'mongoose';

const GameProgressSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        gameId: {
            type: Schema.Types.ObjectId,
            ref: 'Sudoku',
            required: true,
        },
        currentBoard: {
            type: [[Number]],
            required: true,
        },
        seconds: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        completed: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
    {
        collection: 'gameProgress',
        timestamps: true,
    }
);

GameProgressSchema.index({ userId: 1, gameId: 1 }, { unique: true });

export default GameProgressSchema;

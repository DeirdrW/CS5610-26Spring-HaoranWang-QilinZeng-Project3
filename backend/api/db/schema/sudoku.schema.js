import { Schema } from 'mongoose';

const SudokuSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        difficulty: {
            type: String,
            enum: ['EASY', 'NORMAL'],
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        createdByUsername: {
            type: String,
            default: 'Anonymous',
        },
        puzzle: {
            type: [[Number]],
            required: true,
        },
        solution: {
            type: [[Number]],
            required: true,
        },
        currentBoard: {
            type: [[Number]],
            required: true,
        },
        fixedCells: {
            type: [[Boolean]],
            required: true,
        },
        completedBy: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        collection: 'sudokus',
        timestamps: true,
    }
);

export default SudokuSchema;

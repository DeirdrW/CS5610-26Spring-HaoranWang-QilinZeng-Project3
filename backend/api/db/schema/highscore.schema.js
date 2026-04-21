import { Schema } from 'mongoose';

const HighscoreSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        gameId: {
            type: Schema.Types.ObjectId,
            ref: 'Sudoku',
            required: true,
        },
        completionSeconds: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
    },
    {
        collection: 'highscores',
        timestamps: true,
    }
);

HighscoreSchema.index({ userId: 1, gameId: 1 }, { unique: true });

export default HighscoreSchema;

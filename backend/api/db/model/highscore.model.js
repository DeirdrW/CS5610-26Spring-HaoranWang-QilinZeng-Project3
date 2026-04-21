import mongoose from 'mongoose';
import HighscoreSchema from '../schema/highscore.schema.js';

const HighscoreModel = mongoose.model('Highscore', HighscoreSchema);

export function createHighscore(highscore) {
    return HighscoreModel.create(highscore);
}

export function findHighscores() {
    return HighscoreModel.aggregate([
        {
            $group: {
                _id: '$username',
                wins: { $sum: 1 },
            },
        },
        {
            $match: {
                wins: { $gt: 0 },
            },
        },
        {
            $project: {
                _id: 0,
                username: '$_id',
                wins: 1,
            },
        },
        {
            $sort: {
                wins: -1,
                username: 1,
            },
        },
    ]).exec();
}

export function findHighscoresByGameId(gameId) {
    return HighscoreModel.find({ gameId }).sort({ createdAt: 1 }).exec();
}

export function findHighscoreByUserAndGame(userId, gameId) {
    return HighscoreModel.findOne({ userId, gameId }).exec();
}

export function deleteHighscoresByGameId(gameId) {
    return HighscoreModel.deleteMany({ gameId }).exec();
}

export default HighscoreModel;

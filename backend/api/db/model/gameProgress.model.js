import mongoose from 'mongoose';
import GameProgressSchema from '../schema/gameProgress.schema.js';

const GameProgressModel = mongoose.model('GameProgress', GameProgressSchema);

export function createGameProgress(progress) {
    return GameProgressModel.create(progress);
}

export function findGameProgressByUserAndGame(userId, gameId) {
    return GameProgressModel.findOne({ userId, gameId }).exec();
}

export function upsertGameProgressByUserAndGame(userId, gameId, updates, defaults = {}) {
    const setOnInsert = { ...defaults };
    Object.keys(updates || {}).forEach((key) => {
        if (key in setOnInsert) {
            delete setOnInsert[key];
        }
    });

    return GameProgressModel.findOneAndUpdate(
        { userId, gameId },
        {
            $set: updates,
            $setOnInsert: setOnInsert,
        },
        { new: true, upsert: true, runValidators: true }
    ).exec();
}

export function deleteGameProgressByGameId(gameId) {
    return GameProgressModel.deleteMany({ gameId }).exec();
}

export default GameProgressModel;

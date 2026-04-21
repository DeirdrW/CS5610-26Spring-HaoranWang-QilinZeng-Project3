import mongoose from 'mongoose';
import UserSchema from '../schema/user.schema.js';

const UserModel = mongoose.model('User', UserSchema);

export function createUser(user) {
    return UserModel.create(user);
}

export function findUserByUsername(username) {
    return UserModel.findOne({ username }).exec();
}

export function findUserById(id) {
    return UserModel.findById(id).exec();
}

export default UserModel;

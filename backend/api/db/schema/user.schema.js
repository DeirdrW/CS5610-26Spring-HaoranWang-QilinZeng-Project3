import { Schema } from 'mongoose';

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
    },
    {
        collection: 'users',
        timestamps: true,
    }
);

export default UserSchema;

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string; // In a real application, this should be hashed
    role: 'admin' | 'user'; // Define roles
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

export const User = mongoose.model<IUser>('User', userSchema);

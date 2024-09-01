import mongoose, { Document, Schema } from 'mongoose';

export interface ISeason extends Document {
    title: string;
    tvSeriesId: mongoose.Types.ObjectId;
    userIds: mongoose.Types.ObjectId[]; // New field to store user IDs
}

const seasonSchema: Schema = new Schema({
    title: { type: String, required: true },
    tvSeries: { type: Schema.Types.ObjectId, ref: 'TVSeries', required: true },
    userIds: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export const Season = mongoose.model<ISeason>('Season', seasonSchema);

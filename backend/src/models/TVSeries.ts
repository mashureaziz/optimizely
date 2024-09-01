import mongoose, { Document, Schema } from 'mongoose';

export interface ITVSeries extends Document {
    title: string;
    description: string;
}

const tvSeriesSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

export const TVSeries = mongoose.model<ITVSeries>('TVSeries', tvSeriesSchema);

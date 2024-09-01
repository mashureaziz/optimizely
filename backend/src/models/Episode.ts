import mongoose, { Document, Schema } from 'mongoose';

export interface IEpisode extends Document {
    title: string;
    seasonId: mongoose.Types.ObjectId;
}

const episodeSchema: Schema = new Schema({
    title: { type: String, required: true },
    season: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
});

export const Episode = mongoose.model<IEpisode>('Episode', episodeSchema);

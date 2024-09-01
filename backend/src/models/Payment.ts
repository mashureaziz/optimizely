import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    userId: string;
    seasonId: mongoose.Types.ObjectId;
    amount: number;
    date: Date;
}

const paymentSchema: Schema = new Schema({
    userId: { type: String, required: true },
    season: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);

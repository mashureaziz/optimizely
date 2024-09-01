import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { validationResult } from 'express-validator';

export const getPayments = async (req: Request, res: Response) => {
    try {
        const payments = await Payment.find().populate('season');
        res.json(payments);
    } catch (error) {
        throw new Error('Failed to fetch payments');
    }
};

export const addPayment = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        (error as any).status = 400;
        throw error;
    }

    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        res.json(newPayment);
    } catch (error) {
        console.log(error);
        throw new Error('Failed to add payment');
    }
};

export const updatePayment = async (req: Request, res: Response) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPayment) {
            const error = new Error('Payment not found');
            (error as any).status = 404;
            throw error;
        }
        res.json(updatedPayment);
    } catch (error) {
        throw new Error('Failed to update payment');
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        if (!deletedPayment) {
            const error = new Error('Payment not found');
            (error as any).status = 404;
            throw error;
        }
        res.sendStatus(204);
    } catch (error) {
        throw new Error('Failed to delete payment');
    }
};

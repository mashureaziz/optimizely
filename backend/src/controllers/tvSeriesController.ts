import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { TVSeries } from '../models/TVSeries';

export const tvSeriesValidationRules = () => {
    return [
        body('title').isString().notEmpty().withMessage('Title is required'),
        body('description').isString().notEmpty().withMessage('Description is required'),
    ];
};

export const getTVSeries = async (req: Request, res: Response) => {
    try {
        const series = await TVSeries.find();
        res.json(series);
    } catch (error) {
        throw new Error('Failed to fetch TV series');
    }
};

export const addTVSeries = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        (error as any).status = 400; // Set status code for validation errors
        throw error;
    }

    try {
        const newSeries = new TVSeries(req.body);
        await newSeries.save();
        res.json(newSeries);
    } catch (error) {
        throw new Error('Failed to add TV series');
    }
};

export const updateTVSeries = async (req: Request, res: Response) => {
    try {
        const updatedSeries = await TVSeries.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSeries) {
            const error = new Error('TV series not found');
            (error as any).status = 404; // Not found
            throw error;
        }
        res.json(updatedSeries);
    } catch (error) {
        throw new Error('Failed to update TV series');
    }
};

export const deleteTVSeries = async (req: Request, res: Response) => {
    try {
        const deletedSeries = await TVSeries.findByIdAndDelete(req.params.id);
        if (!deletedSeries) {
            const error = new Error('TV series not found');
            (error as any).status = 404; // Not found
            throw error;
        }
        res.sendStatus(204);
    } catch (error) {
        throw new Error('Failed to delete TV series');
    }
};

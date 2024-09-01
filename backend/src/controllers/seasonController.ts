import { Request, Response } from 'express';
import { Season } from '../models/Season';

export const getSeasons = async (req: Request, res: Response) => {
    try {
        const seasons = await Season.find({ tvSeries: req.params.tvSeriesId }).populate('userIds'); // Populate userIds
        res.json(seasons);
    } catch (error) {
        throw new Error('Failed to fetch seasons');
    }
};

export const addSeason = async (req: Request, res: Response) => {
    try {
        const newSeason = new Season(req.body);
        await newSeason.save();
        res.json(newSeason);
    } catch (error) {
        throw new Error('Failed to add season');
    }
};

export const updateSeason = async (req: Request, res: Response) => {
    try {
        const updatedSeason = await Season.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('userIds'); // Populate userIds
        res.json(updatedSeason);
    } catch (error) {
        throw new Error('Failed to update season');
    }
};

export const deleteSeason = async (req: Request, res: Response) => {
    try {
        await Season.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        throw new Error('Failed to delete season');
    }
};

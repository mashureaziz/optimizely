import { Request, Response } from 'express';
import { Episode } from '../models/Episode';

export const getEpisodes = async (req: Request, res: Response) => {
    try {
        const episodes = await Episode.find({ season: req.params.seasonId });
        res.json(episodes);
    } catch (error) {
        throw new Error('Failed to fetch episodes');
    }
};

export const addEpisode = async (req: Request, res: Response) => {
    try {
        const newEpisode = new Episode(req.body);
        await newEpisode.save();
        res.json(newEpisode);
    } catch (error) {
        throw new Error('Failed to add episode');
    }
};

export const updateEpisode = async (req: Request, res: Response) => {
    try {
        const updatedEpisode = await Episode.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEpisode) {
            const error = new Error('Episode not found');
            (error as any).status = 404; // Not found
            throw error;
        }
        res.json(updatedEpisode);
    } catch (error) {
        throw new Error('Failed to update episode');
    }
};

export const deleteEpisode = async (req: Request, res: Response) => {
    try {
        const deletedEpisode = await Episode.findByIdAndDelete(req.params.id);
        if (!deletedEpisode) {
            const error = new Error('Episode not found');
            (error as any).status = 404; // Not found
            throw error;
        }
        res.sendStatus(204);
    } catch (error) {
        throw new Error('Failed to delete episode');
    }
};

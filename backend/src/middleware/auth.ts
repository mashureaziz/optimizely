import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Assume user ID is passed in headers for simplicity
    // In real world setup that should be handled through json-web token
    const userId = req.headers['x-user-id'];

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export default authMiddleware;

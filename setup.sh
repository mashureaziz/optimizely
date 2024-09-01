#!/bin/bash

# Create project structure
mkdir -p backend/src/{controllers,logger,middleware,models,routes}
touch backend/src/{server.ts,swagger.ts}
touch backend/package.json
touch backend/tsconfig.json

# Create package.json
cat <<EOL > backend/package.json
{
  "name": "tv-show-admin-dashboard",
  "version": "1.0.0",
  "main": "src/server.ts",
  "scripts": {
    "start": "ts-node src/server.ts",
    "build": "tsc",
    "serve": "node dist/server.js"
  },
  "dependencies": {
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-rate-limit": "^5.2.6",
    "express-validator": "^6.12.0",
    "helmet": "^4.6.0",
    "mongoose": "^5.10.9",
    "morgan": "^1.10.0",
    "uuid": "^8.3.2",
    "winston": "^3.3.3",
    "swagger-jsdoc": "^6.1.0",
    "swagger-ui-express": "^4.1.6"
  },
  "devDependencies": {
    "@types/body-parser": "^1.19.0",
    "@types/cors": "^2.8.5",
    "@types/express": "^4.17.11",
    "@types/express-rate-limit": "^5.2.0",
    "@types/morgan": "^1.9.1",
    "@types/node": "^14.14.31",
    "typescript": "^4.2.3"
  }
}
EOL

# Create tsconfig.json
cat <<EOL > backend/tsconfig.json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
EOL

# Create logger.ts
cat <<EOL > backend/src/logger.ts
import { createLogger, format, transports } from 'winston';
import path from 'path';

const logger = createLogger({
    level: 'error',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.File({ filename: path.join(__dirname, 'error.log') })
    ],
});

export default logger;
EOL

# Create errorHandler.ts
cat <<EOL > backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const requestId = req.headers['x-request-id'] || 'N/A';

    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        requestId: requestId,
        timestamp: new Date().toISOString(),
    });

    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            requestId: requestId,
        },
    });
};

export default errorHandler;
EOL

# Create requestId.ts
cat <<EOL > backend/src/middleware/requestId.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const requestId = uuidv4();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
};

export default requestIdMiddleware;
EOL

# Create models
cat <<EOL > backend/src/models/TVSeries.ts
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
EOL

cat <<EOL > backend/src/models/Season.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ISeason extends Document {
    title: string;
    tvSeriesId: mongoose.Types.ObjectId;
}

const seasonSchema: Schema = new Schema({
    title: { type: String, required: true },
    tvSeriesId: { type: Schema.Types.ObjectId, ref: 'TVSeries', required: true },
});

export const Season = mongoose.model<ISeason>('Season', seasonSchema);
EOL

cat <<EOL > backend/src/models/Episode.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IEpisode extends Document {
    title: string;
    seasonId: mongoose.Types.ObjectId;
}

const episodeSchema: Schema = new Schema({
    title: { type: String, required: true },
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
});

export const Episode = mongoose.model<IEpisode>('Episode', episodeSchema);
EOL

cat <<EOL > backend/src/models/Payment.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    userId: string;
    seasonId: mongoose.Types.ObjectId;
    amount: number;
    date: Date;
}

const paymentSchema: Schema = new Schema({
    userId: { type: String, required: true },
    seasonId: { type: Schema.Types.ObjectId, ref: 'Season', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
EOL

# Create controllers
cat <<EOL > backend/src/controllers/tvSeriesController.ts
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
        (error as any).status = 400;
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
        res.json(updatedSeries);
    } catch (error) {
        throw new Error('Failed to update TV series');
    }
};

export const deleteTVSeries = async (req: Request, res: Response) => {
    try {
        await TVSeries.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        throw new Error('Failed to delete TV series');
    }
};
EOL

cat <<EOL > backend/src/controllers/seasonController.ts
import { Request, Response } from 'express';
import { Season } from '../models/Season';

export const getSeasons = async (req: Request, res: Response) => {
    try {
        const seasons = await Season.find({ tvSeriesId: req.params.tvSeriesId });
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
        const updatedSeason = await Season.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
EOL

cat <<EOL > backend/src/controllers/episodeController.ts
import { Request, Response } from 'express';
import { Episode } from '../models/Episode';

export const getEpisodes = async (req: Request, res: Response) => {
    try {
        const episodes = await Episode.find({ seasonId: req.params.seasonId });
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
        res.json(updatedEpisode);
    } catch (error) {
        throw new Error('Failed to update episode');
    }
};

export const deleteEpisode = async (req: Request, res: Response) => {
    try {
        await Episode.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        throw new Error('Failed to delete episode');
    }
};
EOL

cat <<EOL > backend/src/controllers/paymentController.ts
import { Request, Response } from 'express';
import { Payment } from '../models/Payment';

export const getPayments = async (req: Request, res: Response) => {
    try {
        const payments = await Payment.find().populate('seasonId');
        res.json(payments);
    } catch (error) {
        throw new Error('Failed to fetch payments');
    }
};

export const addPayment = async (req: Request, res: Response) => {
    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        res.json(newPayment);
    } catch (error) {
        throw new Error('Failed to add payment');
    }
};

export const updatePayment = async (req: Request, res: Response) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPayment);
    } catch (error) {
        throw new Error('Failed to update payment');
    }
};

export const deletePayment = async (req: Request, res: Response) => {
    try {
        await Payment.findByIdAndDelete(req.params.id);
        res.sendStatus(204);
    } catch (error) {
        throw new Error('Failed to delete payment');
    }
};
EOL

# Create routes
cat <<EOL > backend/src/routes/index.ts
import { Router } from 'express';
import {
    getTVSeries,
    addTVSeries,
    updateTVSeries,
    deleteTVSeries,
    tvSeriesValidationRules
} from '../controllers/tvSeriesController';
import {
    getSeasons,
    addSeason,
    updateSeason,
    deleteSeason
} from '../controllers/seasonController';
import {
    getEpisodes,
    addEpisode,
    updateEpisode,
    deleteEpisode
} from '../controllers/episodeController';
import {
    getPayments,
    addPayment,
    updatePayment,
    deletePayment
} from '../controllers/paymentController';

const router = Router();

// TV Series routes
router.get('/tvseries', getTVSeries);
router.post('/tvseries', tvSeriesValidationRules(), addTVSeries);
router.put('/tvseries/:id', tvSeriesValidationRules(), updateTVSeries);
router.delete('/tvseries/:id', deleteTVSeries);

// Season routes
router.get('/seasons/:tvSeriesId', getSeasons);
router.post('/seasons', addSeason);
router.put('/seasons/:id', updateSeason);
router.delete('/seasons/:id', deleteSeason);

// Episode routes
router.get('/episodes/:seasonId', getEpisodes);
router.post('/episodes', addEpisode);
router.put('/episodes/:id', updateEpisode);
router.delete('/episodes/:id', deleteEpisode);

// Payment routes
router.get('/payments', getPayments);
router.post('/payments', addPayment);
router.put('/payments/:id', updatePayment);
router.delete('/payments/:id', deletePayment);

export default router;
EOL

# Create swagger.ts
cat <<EOL > backend/src/swagger.ts
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'TV Show Admin Dashboard API',
            version: '1.0.0',
            description: 'API documentation for the TV Show Admin Dashboard',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: any) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
EOL

echo "Project structure created successfully!"

import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const requestId = req.headers['x-request-id'] || 'N/A';

    // Log the error with the request ID
    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        requestId: requestId,
        timestamp: new Date().toISOString(),
    });

    // Send a generic error response with the request ID
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
            requestId: requestId
        },
    });
};

export default errorHandler;

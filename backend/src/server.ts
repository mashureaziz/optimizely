import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes/index';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './logger';
import rateLimit from 'express-rate-limit';
import errorHandler from './middleware/errorHandler';
import requestIdMiddleware from './middleware/requestId';

const app = express();
const PORT = process.env.PORT || 4000;
// Modify as per local setup
const mongoURI = 'mongodb://localhost:27017/tvshows';

app.use(cors());
app.use(helmet()); // Use Helmet for HTTP headers security
app.use(bodyParser.json({ limit: '1mb' })); // Limit the size of the request body to prevent overflow attack
app.use(morgan('combined', { stream: { write: (message) => logger.error(message.trim()) } })); // Log HTTP requests
app.use(requestIdMiddleware);

// Apply rate limiting to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => logger.error('MongoDB connection error:', err));

app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

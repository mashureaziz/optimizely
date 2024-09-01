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

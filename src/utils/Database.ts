import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import logger from '../middleware/logger';

dotenv.config();

const database = () => {
    const url = process.env.MONGO_URL ?? 'mongodb://localhost:21017/express-test';

    const options: ConnectOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }as any;

    return new Promise((resolve, reject) => {
        mongoose.connect(url, options)
            .then(() => {
                resolve('mongodb connected');
                logger.info('mongodb connected');
            })
            .catch((err) => {
                reject(err);
                logger.error(err);
            });
    });
};

export default database;

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { GridFSBucket } from 'mongodb';

dotenv.config();

let gfs: GridFSBucket;

const db = async (): Promise<typeof mongoose.connection> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jurassic_jobs');
    console.log('Database connected.');

    const connection = mongoose.connection;

    await new Promise<void>((resolve, reject) => {
      connection.once('open', () => {
        if (connection.db) {
          gfs = new GridFSBucket(connection.db, { bucketName: 'uploads' });
          console.log('GridFS initialized.');
          resolve();
        } else {
          console.error('Failed to initialize GridFS: connection.db is undefined.');
          reject(new Error('Failed to initialize GridFS: connection.db is undefined.'));
        }
      });
    });

    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Database connection failed.');
  }
};

export { gfs };
export default db;

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db = async (): Promise<typeof mongoose.connection> => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jurassic_jobs');
    console.log('Database connected.');
    return mongoose.connection;
  } catch (error) {
    console.log(error);
    console.error('Database connection error:', error);
    throw new Error('Database connection failed.');
  }
};

export default db;
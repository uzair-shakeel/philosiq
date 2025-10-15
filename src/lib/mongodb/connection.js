import connectToDatabase from './index';

// Simple wrapper to maintain compatibility with existing API endpoints
const dbConnect = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export default dbConnect;

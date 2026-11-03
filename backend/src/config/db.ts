import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn('⚠️ MONGODB_URI (or MONGO_URI) is not set. MongoDB operations will fail until configured.');
    return;
  }

  try {
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error (${error.message || error}).`);
    console.warn(`💡 To connect, please provide your MongoDB Atlas URI or ensure local MongoDB is running.`);
  }
};


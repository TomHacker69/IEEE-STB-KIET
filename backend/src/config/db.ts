import mongoose from 'mongoose';

let dbConnectionError: string | null = null;

export const getDbStatus = () => {
  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  return {
    status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    readyState: mongoose.connection.readyState,
    hasUri: Boolean(rawUri),
    uriPrefix: rawUri ? rawUri.trim().replace(/^['"]|['"]$/g, '').substring(0, 25) + '...' : null,
    lastError: dbConnectionError,
  };
};

export const connectDB = async (): Promise<void> => {
  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!rawUri) {
    dbConnectionError = 'MONGODB_URI (or MONGO_URI) is not set in environment variables';
    console.warn(`⚠️ ${dbConnectionError}. MongoDB operations will fail until configured.`);
    return;
  }

  const mongoUri = rawUri.trim().replace(/^['"]|['"]$/g, '');

  try {
    const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
    dbConnectionError = null;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error: any) {
    dbConnectionError = error?.message || String(error);
    console.error(`❌ MongoDB Connection Error (${dbConnectionError}).`);
    console.warn(`💡 To connect, please provide your MongoDB Atlas URI or ensure network access is allowed.`);
  }
};

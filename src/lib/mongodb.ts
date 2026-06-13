import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || '';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGO_URI is not set. Running in local mock fallback mode.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB Connected (Cached)');
      return mongooseInstance;
    }).catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.warn('⚠️ Running server in local mock fallback mode.');
      cached.promise = null; // Reset to retry on next request if server recovers
      return null;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

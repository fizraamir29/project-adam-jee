import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || '';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, failedAt: 0 };
}

// Only retry MongoDB connection every 60 seconds after a failure
const RETRY_AFTER_MS = 60_000;

export async function connectDB() {
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  // If we recently failed, don't retry — fall through to mock mode immediately
  if (cached.failedAt && Date.now() - cached.failedAt < RETRY_AFTER_MS) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✅ MongoDB Connected (Cached)');
      cached.failedAt = 0; // Reset failed state on success
      return mongooseInstance;
    }).catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.warn('⚠️ Running server in local mock fallback mode.');
      cached.promise = null; // Reset to allow retry after backoff
      cached.failedAt = Date.now(); // Record failure time
      return null;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

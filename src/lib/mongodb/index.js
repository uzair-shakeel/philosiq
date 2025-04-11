import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://uzair:uzair123@ac-gxnmdjp-shard-00-00.cpammnv.mongodb.net:27017,ac-gxnmdjp-shard-00-01.cpammnv.mongodb.net:27017,ac-gxnmdjp-shard-00-02.cpammnv.mongodb.net:27017/Philosiq?ssl=true&replicaSet=atlas-bfokwp-shard-0&authSource=admin&retryWrites=true&w=majority&appName=API";

// Mongoose connection cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connection established successfully");
    // Log available collections
    const collections = Object.keys(mongoose.connection.collections);
    console.log("Available collections:", collections);
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default connectToDatabase;

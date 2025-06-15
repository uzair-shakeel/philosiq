import { MongoClient } from "mongodb";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://uzair:uzair123@ac-gxnmdjp-shard-00-00.cpammnv.mongodb.net:27017,ac-gxnmdjp-shard-00-01.cpammnv.mongodb.net:27017,ac-gxnmdjp-shard-00-02.cpammnv.mongodb.net:27017/Philosiq?ssl=true&replicaSet=atlas-bfokwp-shard-0&authSource=admin&retryWrites=true&w=majority&appName=API";

const MONGODB_DB = process.env.MONGODB_DB || "Philosiq";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!MONGODB_DB) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI, {});

  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

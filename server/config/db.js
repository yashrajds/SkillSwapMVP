import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

function hasPlaceholderUri(value = "") {
  return !value || /<[^>]+>/.test(value);
}

export async function connectDB() {
  let mongoUri = process.env.MONGO_URI;
  const shouldUseMemoryDb = process.env.USE_IN_MEMORY_DB === "true";

  if (shouldUseMemoryDb || hasPlaceholderUri(mongoUri)) {
    memoryServer = await MongoMemoryServer.create();
    mongoUri = memoryServer.getUri("skillswap");
    console.log("Using in-memory MongoDB for local development");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
}

export async function disconnectDB() {
  await mongoose.disconnect();

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = undefined;
  }
}

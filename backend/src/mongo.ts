import mongoose from "mongoose";

export const connectToMongo = async () => {
  let MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || '';

  if (MONGO_CONNECTION_STRING === '') {
    const MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';
    const MONGO_PORT = process.env.MONGO_PORT || '27017';
    const MONGO_AUTH_SOURCE = process.env.MONGO_AUTH_SOURCE || 'test';
    const MONGO_USERNAME = process.env.MONGO_USER || 'testUser'
    const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
    if (MONGO_PASSWORD === '') {
      throw "app requires a MONGO_PASSWORD environment variable";
    }
    MONGO_CONNECTION_STRING = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_AUTH_SOURCE}?authSource=${MONGO_AUTH_SOURCE}`;
  }
  
  const db = mongoose.connection;
  db.on('connecting', function() {
    console.log('Connecting to MongoDB...');
  });
  db.on('connected', function() {
    console.log('Connected to MongoDB');
  });
  db.once('open', () => {
    console.log("Successfully connected to MongoDB");
  });
  db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });
  db.on('reconnected', function () {
    console.log('Reconnected to MongoDB');
  });
  db.on('disconnected', function() {
    console.warn('Disconnected from MongoDB');
  });

  await mongoose.connect(MONGO_CONNECTION_STRING);

  return db;
}
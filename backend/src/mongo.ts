import mongoose from "mongoose";

export const connectToMongo = () => {
  const MONGO_HOST = process.env.MONGO_HOST || '127.0.0.1';
  const MONGO_PORT = process.env.MONGO_PORT || '27017';
  const MONGO_AUTH_SOURCE = process.env.MONGO_AUTH_SOURCE || 'shapeDrawer';
  const MONGO_USERNAME = process.env.MONGO_USER || 'shapeDrawerAppServer'
  const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
  if (MONGO_PASSWORD === '') {
    throw "app requires a MONGO_PASSWORD environment variable";
  }
  
  mongoose.connect(
    `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_AUTH_SOURCE}?authSource=${MONGO_AUTH_SOURCE}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log("Successfully connected to mongodb");
  })

  return db;
}
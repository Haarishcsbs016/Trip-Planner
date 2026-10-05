const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log('🔄 Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`✅ MongoDB Connected to Atlas: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`⚠️ MongoDB Atlas Connection Error: ${error.message}`);
      console.warn('⚠️ Attempting fallback to In-Memory MongoDB Server...');
    }
  }

  try {
    console.log('🔄 Fallback to In-Memory MongoDB Server (v4.4.26)...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create({
      binary: { version: '4.4.26' }
    });
    const memUri = mongoServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
  } catch (memError) {

    console.error(`⚠️ Could not initialize In-Memory MongoDB (${memError.message}).`);
    console.warn('⚠️ Server will run, but database operations may require a running MongoDB connection.');
  }
};

module.exports = connectDB;


const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // In test mode, prefer MongoMemoryServer for fast isolated test execution
  if (process.env.NODE_ENV === 'test') {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ In-Memory Test MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (memErr) {
      console.warn(`⚠️ In-Memory MongoDB in test mode failed: ${memErr.message}. Attempting MONGODB_URI...`);
    }
  }

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
    console.log('🔄 Fallback to In-Memory MongoDB Server...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const memUri = mongoServer.getUri();
    const conn = await mongoose.connect(memUri);
    console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}`);
  } catch (memError) {
    console.error(`⚠️ Could not initialize In-Memory MongoDB (${memError.message}).`);
    console.warn('⚠️ Server will run, but database operations may require a running MongoDB connection.');
  }
};

module.exports = connectDB;


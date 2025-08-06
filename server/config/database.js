const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MongoDB URI not provided, running in demo mode without database');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error during MongoDB disconnection:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.log('⚠️  Running in demo mode without database connection');
    // Don't exit in development mode, allow server to run without DB
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;

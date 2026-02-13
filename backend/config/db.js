// ============================================
// DATABASE CONNECTION CONFIGURATION
// config/db.js
// ============================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Connection Options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);

  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }

  // Handle connection events
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB error: ${err}`);
  });
};

module.exports = connectDB;

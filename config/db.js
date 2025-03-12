const mongoose = require("mongoose");

// Track the connection state globally
let isConnected = false;

const connectDB = async () => {
  // Check if already connected
  if (isConnected) {
    console.log("MongoDB is already connected");
    return; // Don't try to connect again
  }

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isConnected = true; // Set the flag to true after successful connection
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

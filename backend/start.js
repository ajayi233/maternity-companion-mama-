import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './src/app.js';

// Load environment variables
dotenv.config();

// Debug environment variables
console.log('🔧 Environment Debug:');
console.log('- MNOTIFY_API_KEY:', process.env.MNOTIFY_API_KEY ? 'Present' : 'Missing');
console.log('- MNOTIFY_BASE_URL:', process.env.MNOTIFY_BASE_URL || 'Missing');
console.log('- SMS_SIMULATION_MODE:', process.env.SMS_SIMULATION_MODE || 'Missing');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 MAMA Backend API ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});
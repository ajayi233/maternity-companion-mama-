import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['push', 'sms'],
    required: true
  },
  category: {
    type: String,
    enum: ['appointment', 'medication', 'emergency', 'educational', 'reminder'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'sent', 'delivered', 'failed'],
    default: 'scheduled'
  },
  scheduledFor: Date,
  sentAt: Date,
  deliveredAt: Date,
  data: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

export default mongoose.model('Notification', notificationSchema);
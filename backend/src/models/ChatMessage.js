import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'en'
  },
  messageType: {
    type: String,
    enum: ['symptoms', 'nutrition', 'exercise', 'general'],
    default: 'general'
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  suggestions: [String]
}, {
  timestamps: true
});

export default mongoose.model('ChatMessage', chatMessageSchema);
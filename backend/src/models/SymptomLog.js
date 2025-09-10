import mongoose from 'mongoose';

const symptomLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: [{
    name: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
    duration: String,
    notes: String
  }],
  pregnancyWeek: {
    type: Number,
    required: true
  },
  aiAnalysis: {
    severity: { type: String, enum: ['low', 'medium', 'high'] },
    urgency: Boolean,
    recommendations: [String],
    shouldContactDoctor: Boolean,
    confidence: Number
  },
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  resolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('SymptomLog', symptomLogSchema);
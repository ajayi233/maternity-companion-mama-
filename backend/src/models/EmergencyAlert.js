import mongoose from 'mongoose';

const emergencyAlertSchema = new mongoose.Schema({
  alertId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  emergencyType: {
    type: String,
    enum: ['general', 'bleeding', 'labor', 'pain'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['dispatched', 'responded', 'resolved', 'cancelled'],
    default: 'dispatched'
  },
  nearestFacilities: [{
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
    distance: Number,
    name: String
  }],
  responseTime: {
    estimated: String,
    actual: String,
    confidence: String
  },
  notes: String
}, {
  timestamps: true
});

export default mongoose.model('EmergencyAlert', emergencyAlertSchema);
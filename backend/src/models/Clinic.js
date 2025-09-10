import mongoose from 'mongoose';

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add clinic name'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please add address']
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    }
  },
  phone: String,
  services: [{
    type: String,
    enum: ['prenatal', 'delivery', 'postnatal', 'emergency', 'ultrasound', 'laboratory', 'pharmacy']
  }],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  availability: [{
    date: Date,
    timeSlots: [String],
    fullyBooked: { type: Boolean, default: false }
  }],
  staff: [{
    name: String,
    role: String,
    specialization: String
  }],
  rating: {
    average: { type: Number, min: 1, max: 5, default: 3 },
    count: { type: Number, default: 0 },
    reviews: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      date: { type: Date, default: Date.now }
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Clinic', clinicSchema);
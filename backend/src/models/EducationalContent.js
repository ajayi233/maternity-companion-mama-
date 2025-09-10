import mongoose from 'mongoose';

const educationalContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  summary: String,
  category: {
    type: String,
    enum: ['prenatal', 'nutrition', 'exercise', 'labor', 'postnatal', 'emergency'],
    required: true
  },
  language: {
    type: String,
    enum: ['en', 'tw'],
    default: 'en'
  },
  targetWeek: {
    start: { type: Number, min: 1, max: 42 },
    end: { type: Number, min: 1, max: 42 }
  },
  trimester: {
    type: Number,
    enum: [1, 2, 3, 0], // 0 for all trimesters
    default: 0
  },
  mediaUrls: [String],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  author: String
}, {
  timestamps: true
});

export default mongoose.model('EducationalContent', educationalContentSchema);
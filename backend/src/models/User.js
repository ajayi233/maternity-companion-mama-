import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  pregnancyData: {
    dueDate: Date,
    currentWeek: { type: Number, min: 1, max: 42 },
    isPregnant: { type: Boolean, default: false },
    lastMenstrualPeriod: Date,
    estimatedConceptionDate: Date,
    trimester: { type: Number, min: 1, max: 3 },
    complications: [String],
    appointments: [{
      date: Date,
      type: String,
      clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
      notes: String,
      completed: { type: Boolean, default: false }
    }],
    symptoms: [{
      symptom: String,
      severity: { type: String, enum: ['low', 'medium', 'high'] },
      date: { type: Date, default: Date.now },
      week: Number
    }],
    measurements: [{
      type: { type: String, enum: ['weight', 'blood_pressure', 'glucose'] },
      value: String,
      date: { type: Date, default: Date.now },
      week: Number
    }]
  },
  preferences: {
    language: { type: String, default: 'en' },
    notifications: { type: Boolean, default: true }
  },
  refreshTokens: [{
    token: String,
    createdAt: { type: Date, default: Date.now, expires: '7d' }
  }],
  passwordResetToken: String,
  passwordResetExpires: Date,
  isPhoneVerified: { type: Boolean, default: false },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String
  }],
  medicalHistory: {
    allergies: [String],
    conditions: [String],
    medications: [String],
    bloodType: String
  },
  lastActive: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
  return resetToken;
};

userSchema.methods.addRefreshToken = function(token) {
  this.refreshTokens.push({ token });
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
};

userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
};

userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { loginAttempts: 1, lockUntil: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = {
      lockUntil: Date.now() + 2 * 60 * 60 * 1000
    };
  }
  
  return this.updateOne(updates);
};

userSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 }
  });
};

export default mongoose.model('User', userSchema);
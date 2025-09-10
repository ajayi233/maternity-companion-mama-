import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

class AuthService {
  async registerUser(userData) {
    const { name, phone, password, dueDate } = userData;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      throw new Error('User already exists with this phone number');
    }

    const user = await User.create({
      name,
      phone,
      password,
      pregnancyData: {
        dueDate,
        isPregnant: !!dueDate
      }
    });

    // Send welcome SMS
    const { default: notificationService } = await import('./notificationService.js');
    await notificationService.sendSMS(
      phone,
      `Welcome to MAMA! Your maternal health companion is ready to support your pregnancy journey.`
    );

    return {
      user: this.sanitizeUser(user),
      token: this.generateToken(user._id)
    };
  }

  async loginUser(phone, password) {
    // Find user with password
    const user = await User.findOne({ phone }).select('+password');
    
    if (!user || !(await user.matchPassword(password))) {
      throw new Error('Invalid credentials');
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    return {
      user: this.sanitizeUser(user),
      token: this.generateToken(user._id)
    };
  }

  async refreshToken(userId) {
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    return {
      user: this.sanitizeUser(user),
      token: this.generateToken(user._id)
    };
  }

  async sendPasswordResetCode(phone) {
    try {
      console.log('🔐 Password Reset - Phone:', phone);
      
      const user = await User.findOne({ phone });
      if (!user) {
        throw new Error('User not found');
      }

      console.log('🔐 Password Reset - User found:', user._id);

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('🔐 Password Reset - Generated code:', code);
      
      const { default: PasswordReset } = await import('../models/PasswordReset.js');
      const resetRecord = await PasswordReset.create({
        userId: user._id,
        code
      });

      console.log('🔐 Password Reset - Reset record created:', resetRecord._id);

      const { default: notificationService } = await import('./notificationService.js');
      const smsResult = await notificationService.sendSMS(
        phone,
        `Your MAMA password reset code is: ${code}. Valid for 10 minutes.`
      );

      console.log('🔐 Password Reset - SMS result:', smsResult);

      if (!smsResult.success) {
        console.error('❌ Password Reset - SMS failed:', smsResult.error);
        // Still return success but log the SMS failure
        return { 
          message: 'Reset code generated but SMS delivery failed. Please try again.',
          smsError: smsResult.error
        };
      }

      return { message: 'Reset code sent to your phone' };
    } catch (error) {
      console.error('❌ Password Reset Error:', error);
      throw error;
    }
  }

  async resetPasswordWithCode(phone, code, newPassword) {
    const user = await User.findOne({ phone });
    if (!user) {
      throw new Error('User not found');
    }

    const { default: PasswordReset } = await import('../models/PasswordReset.js');
    const resetRecord = await PasswordReset.findOne({
      userId: user._id,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });

    if (!resetRecord) {
      throw new Error('Invalid or expired reset code');
    }

    user.password = newPassword;
    await user.save();

    resetRecord.isUsed = true;
    await resetRecord.save();

    const { default: notificationService } = await import('./notificationService.js');
    await notificationService.sendSMS(
      phone,
      `Your MAMA password has been successfully reset. If this wasn't you, contact support immediately.`
    );

    return { message: 'Password reset successful' };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    
    if (!(await user.matchPassword(currentPassword))) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  async updateProfile(userId, updateData) {
    const allowedUpdates = ['name', 'phone', 'preferences', 'emergencyContacts', 'profileImage'];
    const updates = {};

    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = updateData[key];
      }
    });

    const user = await User.findByIdAndUpdate(userId, updates, { 
      new: true, 
      runValidators: true 
    });

    return this.sanitizeUser(user);
  }

  async deactivateAccount(userId) {
    const user = await User.findByIdAndUpdate(
      userId, 
      { isActive: false }, 
      { new: true }
    );

    return { message: 'Account deactivated successfully' };
  }

  generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  sanitizeUser(user) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  async validateUserSession(userId) {
    const user = await User.findById(userId);
    
    if (!user || !user.isActive) {
      return { valid: false, reason: 'User not found or inactive' };
    }

    // Check if user has been inactive for too long (30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (user.lastActive < thirtyDaysAgo) {
      return { valid: false, reason: 'Session expired due to inactivity' };
    }

    return { valid: true, user: this.sanitizeUser(user) };
  }

  async updateLastActive(userId) {
    await User.findByIdAndUpdate(userId, { lastActive: new Date() });
  }

  generatePasswordResetToken(userId) {
    return jwt.sign({ id: userId, type: 'password_reset' }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
  }

  verifyPasswordResetToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }
  }
}

export default new AuthService();
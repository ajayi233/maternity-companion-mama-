import { validationResult } from 'express-validator';
import User from '../models/User.js';
import authService from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const result = await authService.registerUser(req.body);
    
    const options = {
      expires: new Date(Date.now() + (process.env.COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.status(201)
      .cookie('token', result.token, options)
      .json({
        success: true,
        token: result.token,
        user: result.user
      });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, error: 'Please provide phone and password' });
    }

    const result = await authService.loginUser(phone, password);
    
    const options = {
      expires: new Date(Date.now() + (process.env.COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };

    res.status(200)
      .cookie('token', result.token, options)
      .json({
        success: true,
        token: result.token,
        user: result.user
      });
  } catch (error) {
    next(error);
  }
};



export const sendPasswordResetCode = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ success: false, error: 'Phone number is required' });
    }

    const result = await authService.sendPasswordResetCode(phone);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordWithCode = async (req, res, next) => {
  try {
    const { phone, code, newPassword } = req.body;
    
    if (!phone || !code || !newPassword) {
      return res.status(400).json({ success: false, error: 'Phone, code, and new password are required' });
    }

    const result = await authService.resetPasswordWithCode(phone, code, newPassword);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user.id);
    await authService.updateLastActive(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user.id, currentPassword, newPassword);
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    next(error);
  }
};
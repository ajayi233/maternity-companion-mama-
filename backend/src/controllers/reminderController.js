import Reminder from '../models/Reminder.js';

export const getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ 
      userId: req.user.id, 
      isActive: true 
    }).sort({ scheduledFor: 1 });

    res.status(200).json({ success: true, data: reminders });
  } catch (error) {
    next(error);
  }
};

export const createReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({ success: true, data: reminder });
  } catch (error) {
    next(error);
  }
};

export const updateReminder = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ success: false, error: 'Reminder not found' });
    }

    res.status(200).json({ success: true, data: reminder });
  } catch (error) {
    next(error);
  }
};
import User from '../models/User.js';

export const updatePregnancyData = async (req, res, next) => {
  try {
    const { dueDate, currentWeek, isPregnant } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        'pregnancyData.dueDate': dueDate,
        'pregnancyData.currentWeek': currentWeek,
        'pregnancyData.isPregnant': isPregnant
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: user.pregnancyData });
  } catch (error) {
    next(error);
  }
};

export const getPregnancyProgress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.pregnancyData.isPregnant) {
      return res.status(400).json({ success: false, error: 'No active pregnancy data' });
    }

    const { default: pregnancyService } = await import('../services/pregnancyService.js');
    const progress = pregnancyService.calculatePregnancyProgress(
      user.pregnancyData.dueDate,
      user.pregnancyData.currentWeek
    );

    const tips = pregnancyService.generatePersonalizedTips(
      user.pregnancyData.currentWeek,
      progress.trimester,
      user.preferences
    );

    res.status(200).json({ 
      success: true, 
      data: { ...progress, personalizedTips: tips }
    });
  } catch (error) {
    next(error);
  }
};
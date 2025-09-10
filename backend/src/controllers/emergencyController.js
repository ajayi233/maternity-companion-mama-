export const triggerEmergency = async (req, res, next) => {
  try {
    const { location, emergencyType = 'general' } = req.body;

    if (!location) {
      return res.status(400).json({ success: false, error: 'Location is required' });
    }

    const { default: emergencyService } = await import('../services/emergencyService.js');
    
    const locationValidation = emergencyService.validateEmergencyLocation(location);
    if (!locationValidation.valid) {
      return res.status(400).json({ success: false, error: locationValidation.error });
    }

    const emergencyResponse = await emergencyService.handleEmergencyAlert(
      req.user.id,
      location,
      emergencyType
    );

    res.status(200).json({ success: true, data: emergencyResponse });
  } catch (error) {
    next(error);
  }
};
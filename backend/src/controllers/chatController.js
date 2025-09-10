export const sendMessage = async (req, res, next) => {
  try {
    const { message, language = 'en' } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const { default: aiService } = await import('../services/aiService.js');
    
    const userContext = {
      pregnancyWeek: req.user.pregnancyData?.currentWeek,
      trimester: req.user.pregnancyData?.currentWeek <= 12 ? 1 : req.user.pregnancyData?.currentWeek <= 26 ? 2 : 3
    };

    const aiResponse = await aiService.processMessage(message, language, userContext);

    res.status(200).json({ success: true, data: aiResponse });
  } catch (error) {
    next(error);
  }
};

export const getSymptomAdvice = async (req, res, next) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms)) {
      return res.status(400).json({ success: false, error: 'Symptoms array is required' });
    }

    const { default: aiService } = await import('../services/aiService.js');
    const pregnancyWeek = req.user.pregnancyData?.currentWeek || 1;
    const advice = await aiService.analyzeSymptoms(symptoms, pregnancyWeek);

    res.status(200).json({ success: true, data: advice });
  } catch (error) {
    next(error);
  }
};
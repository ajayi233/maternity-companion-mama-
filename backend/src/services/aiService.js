class AIService {
  async processMessage(message, language = 'en', userContext = {}) {
    // Mock AI processing - integrate with OpenAI/Claude API
    const responses = {
      en: {
        greeting: "Hello! I'm MAMA, your pregnancy companion. How can I help you today?",
        symptoms: "Based on your symptoms, here's what I recommend...",
        nutrition: "For healthy pregnancy nutrition, focus on...",
        exercise: "Safe exercises during pregnancy include...",
        default: "I'm here to support your pregnancy journey. What would you like to know?"
      },
      tw: {
        greeting: "Akwaaba! Me ne MAMA, wo nyinsɛn boafo. Sɛn na metumi aboa wo nnɛ?",
        symptoms: "Sɛ wo ho nsɛm yi de a, mekamfo sɛ...",
        nutrition: "Nyinsɛn bere mu aduane pa ho, fa w'adwene si...",
        default: "Mewɔ ha sɛ meboa wo wɔ wo nyinsɛn akwan no mu."
      }
    };

    const langResponses = responses[language] || responses.en;
    const messageType = this.classifyMessage(message);
    
    return {
      response: langResponses[messageType] || langResponses.default,
      confidence: 0.85,
      suggestions: this.generateSuggestions(messageType, language),
      timestamp: new Date()
    };
  }

  classifyMessage(message) {
    const keywords = {
      symptoms: ['pain', 'nausea', 'tired', 'sick', 'hurt'],
      nutrition: ['eat', 'food', 'diet', 'vitamin', 'nutrition'],
      exercise: ['exercise', 'workout', 'walk', 'yoga', 'fitness']
    };

    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(word => message.toLowerCase().includes(word))) {
        return type;
      }
    }
    return 'default';
  }

  generateSuggestions(messageType, language) {
    const suggestions = {
      en: {
        symptoms: ['Track your symptoms', 'Contact your doctor', 'Rest and hydrate'],
        nutrition: ['Eat folate-rich foods', 'Take prenatal vitamins', 'Stay hydrated'],
        exercise: ['Try prenatal yoga', 'Take daily walks', 'Do pelvic exercises']
      },
      tw: ['Hwɛ wo ho nsɛm', 'Frɛ wo dɔkta', 'Home na nom nsuo']
    };

    return suggestions[language]?.[messageType] || suggestions.en[messageType] || [];
  }

  async analyzeSymptoms(symptoms, pregnancyWeek) {
    const riskFactors = {
      high: ['bleeding', 'severe pain', 'fever', 'vision changes'],
      medium: ['headache', 'swelling', 'dizziness', 'cramping'],
      low: ['nausea', 'fatigue', 'back pain', 'heartburn']
    };

    let severity = 'low';
    let urgency = false;

    for (const symptom of symptoms) {
      if (riskFactors.high.some(risk => symptom.toLowerCase().includes(risk))) {
        severity = 'high';
        urgency = true;
        break;
      } else if (riskFactors.medium.some(risk => symptom.toLowerCase().includes(risk))) {
        severity = 'medium';
      }
    }

    return {
      severity,
      urgency,
      recommendations: this.getRecommendations(severity, pregnancyWeek),
      shouldContactDoctor: urgency || severity === 'high'
    };
  }

  getRecommendations(severity, week) {
    const recommendations = {
      high: ['Seek immediate medical attention', 'Go to emergency room', 'Call your doctor now'],
      medium: ['Monitor symptoms closely', 'Contact healthcare provider', 'Rest and observe'],
      low: ['Normal pregnancy symptom', 'Stay hydrated', 'Get adequate rest']
    };

    return recommendations[severity] || recommendations.low;
  }
}

export default new AIService();
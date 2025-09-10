class PregnancyService {
  calculatePregnancyProgress(dueDate, currentWeek) {
    const due = new Date(dueDate);
    const today = new Date();
    const daysRemaining = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    return {
      currentWeek,
      daysRemaining: Math.max(0, daysRemaining),
      trimester: this.getTrimester(currentWeek),
      progressPercentage: Math.min(100, Math.round((currentWeek / 40) * 100)),
      milestones: this.getWeeklyMilestones(currentWeek),
      nextAppointment: this.suggestNextAppointment(currentWeek)
    };
  }

  getTrimester(week) {
    if (week <= 12) return 1;
    if (week <= 26) return 2;
    return 3;
  }

  getWeeklyMilestones(week) {
    const milestones = {
      8: "Baby's heart starts beating",
      12: "End of first trimester",
      16: "You might feel first movements",
      20: "Anatomy scan time",
      24: "Viability milestone",
      28: "Third trimester begins",
      32: "Baby's bones are hardening",
      36: "Baby is considered full-term soon",
      40: "Due date!"
    };

    return Object.entries(milestones)
      .filter(([w]) => parseInt(w) >= week)
      .slice(0, 3)
      .map(([w, milestone]) => ({ week: parseInt(w), milestone }));
  }

  suggestNextAppointment(currentWeek) {
    const schedule = {
      1: { weeks: 4, type: 'Initial prenatal visit' },
      12: { weeks: 4, type: 'Regular checkup' },
      28: { weeks: 2, type: 'Frequent monitoring' },
      36: { weeks: 1, type: 'Weekly checkups' }
    };

    for (const [week, info] of Object.entries(schedule).reverse()) {
      if (currentWeek >= parseInt(week)) {
        return {
          inWeeks: info.weeks,
          type: info.type,
          recommended: true
        };
      }
    }

    return { inWeeks: 4, type: 'Initial visit', recommended: true };
  }

  generatePersonalizedTips(week, trimester, userPreferences = {}) {
    const tips = {
      1: {
        nutrition: ['Take folic acid supplements', 'Avoid alcohol and smoking'],
        exercise: ['Light walking is great', 'Avoid high-impact activities'],
        wellness: ['Get plenty of rest', 'Stay hydrated']
      },
      2: {
        nutrition: ['Increase protein intake', 'Eat calcium-rich foods'],
        exercise: ['Prenatal yoga is beneficial', 'Swimming is excellent'],
        wellness: ['Practice relaxation techniques', 'Monitor weight gain']
      },
      3: {
        nutrition: ['Small frequent meals', 'Avoid lying down after eating'],
        exercise: ['Pelvic floor exercises', 'Gentle stretching'],
        wellness: ['Prepare birth plan', 'Pack hospital bag']
      }
    };

    return tips[trimester] || tips[1];
  }

  trackSymptomPatterns(symptoms, userId) {
    // Mock pattern analysis - would integrate with ML service
    return {
      commonSymptoms: ['nausea', 'fatigue', 'back pain'],
      newSymptoms: symptoms.filter(s => !['nausea', 'fatigue'].includes(s)),
      severity: 'normal',
      trends: 'stable'
    };
  }
}

export default new PregnancyService();
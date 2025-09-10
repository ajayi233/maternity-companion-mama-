import Reminder from '../models/Reminder.js';

class ReminderService {
  async createPersonalizedReminders(userId, pregnancyData) {
    const { currentWeek, dueDate } = pregnancyData;
    const reminders = [];

    // Generate appointment reminders
    const appointmentSchedule = this.getAppointmentSchedule(currentWeek);
    for (const appointment of appointmentSchedule) {
      reminders.push({
        userId,
        title: appointment.title,
        message: appointment.message,
        type: 'appointment',
        scheduledFor: appointment.date
      });
    }

    // Generate medication reminders
    const medications = this.getMedicationReminders(currentWeek);
    for (const med of medications) {
      reminders.push({
        userId,
        title: med.title,
        message: med.message,
        type: 'medication',
        scheduledFor: med.nextDose
      });
    }

    // Generate exercise reminders
    const exercises = this.getExerciseReminders(currentWeek);
    for (const exercise of exercises) {
      reminders.push({
        userId,
        title: exercise.title,
        message: exercise.message,
        type: 'exercise',
        scheduledFor: exercise.scheduledFor
      });
    }

    return await Reminder.insertMany(reminders);
  }

  getAppointmentSchedule(currentWeek) {
    const appointments = [];
    const today = new Date();

    if (currentWeek < 12) {
      // First trimester - monthly visits
      appointments.push({
        title: 'Prenatal Checkup',
        message: 'Time for your monthly prenatal visit',
        date: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000)
      });
    } else if (currentWeek < 28) {
      // Second trimester - bi-weekly
      appointments.push({
        title: 'Prenatal Checkup',
        message: 'Your bi-weekly prenatal appointment is due',
        date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
      });
    } else {
      // Third trimester - weekly
      appointments.push({
        title: 'Weekly Checkup',
        message: 'Time for your weekly prenatal visit',
        date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      });
    }

    return appointments;
  }

  getMedicationReminders(currentWeek) {
    const medications = [
      {
        title: 'Prenatal Vitamins',
        message: 'Take your daily prenatal vitamin',
        nextDose: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        title: 'Folic Acid',
        message: 'Don\'t forget your folic acid supplement',
        nextDose: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    ];

    if (currentWeek >= 20) {
      medications.push({
        title: 'Iron Supplement',
        message: 'Time for your iron supplement',
        nextDose: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
    }

    return medications;
  }

  getExerciseReminders(currentWeek) {
    const exercises = [];
    const today = new Date();

    exercises.push({
      title: 'Daily Walk',
      message: 'Take a 20-30 minute walk for your health',
      scheduledFor: new Date(today.getTime() + 24 * 60 * 60 * 1000)
    });

    if (currentWeek >= 12) {
      exercises.push({
        title: 'Prenatal Yoga',
        message: 'Time for your prenatal yoga session',
        scheduledFor: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
      });
    }

    if (currentWeek >= 28) {
      exercises.push({
        title: 'Pelvic Floor Exercises',
        message: 'Practice your pelvic floor exercises',
        scheduledFor: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      });
    }

    return exercises;
  }

  async getUpcomingReminders(userId, days = 7) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    return await Reminder.find({
      userId,
      scheduledFor: { $lte: endDate },
      isCompleted: false,
      isActive: true
    }).sort({ scheduledFor: 1 });
  }

  async markReminderComplete(reminderId, userId) {
    return await Reminder.findOneAndUpdate(
      { _id: reminderId, userId },
      { isCompleted: true },
      { new: true }
    );
  }

  async generateWeeklyReport(userId) {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const completedReminders = await Reminder.find({
      userId,
      isCompleted: true,
      updatedAt: { $gte: weekAgo }
    });

    const totalReminders = await Reminder.find({
      userId,
      scheduledFor: { $gte: weekAgo },
      isActive: true
    });

    return {
      completionRate: Math.round((completedReminders.length / totalReminders.length) * 100),
      completedCount: completedReminders.length,
      totalCount: totalReminders.length,
      categories: this.categorizeReminders(completedReminders)
    };
  }

  categorizeReminders(reminders) {
    const categories = {};
    reminders.forEach(reminder => {
      categories[reminder.type] = (categories[reminder.type] || 0) + 1;
    });
    return categories;
  }
}

export default new ReminderService();
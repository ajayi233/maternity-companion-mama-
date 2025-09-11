class NotificationService {
  async sendPushNotification(userId, notification) {
    const pushPayload = {
      userId,
      title: notification.title,
      body: notification.message,
      data: notification.data || {},
      timestamp: new Date()
    };

    console.log(`📱 PUSH NOTIFICATION - ${userId}:`, pushPayload);

    return {
      success: true,
      messageId: `push-${Date.now()}`,
      deliveryStatus: 'sent'
    };
  }

  async sendSMS(phoneNumber, message, language = 'en') {
    try {
      console.log('📱 NotificationService - Sending SMS to:', phoneNumber);
      
      const { default: mnotifyService } = await import('./mnotifyService.js');
      
      const formattedNumber = mnotifyService.formatGhanaianNumber(phoneNumber);
      const translatedMessage = this.translateMessage(message, language);
      
      console.log('📱 NotificationService - Formatted number:', formattedNumber);
      console.log('📱 NotificationService - Translated message:', translatedMessage);
      
      const result = await mnotifyService.sendSMS(formattedNumber, translatedMessage);
      
      if (result.success) {
        console.log('✅ SMS sent successfully:', result.messageId);
      } else {
        console.error('❌ SMS failed:', result.error);
      }
      
      return result;
    } catch (error) {
      console.error('❌ NotificationService SMS Error:', error);
      return {
        success: false,
        error: error.message,
        status: 'failed'
      };
    }
  }

  translateMessage(message, language) {
    const translations = {
      en: message,
      tw: this.translateToTwi(message)
    };

    return translations[language] || message;
  }

  translateToTwi(message) {
    // Mock translation - integrate with Google Translate API
    const commonTranslations = {
      'Appointment reminder': 'Nhyiamu nkae',
      'Take your medication': 'Nom w\'aduru',
      'Emergency alert': 'Ntɛm so kɔkɔbɔ',
      'Pregnancy update': 'Nyinsɛn nsɛm foforo'
    };

    return commonTranslations[message] || message;
  }

  async scheduleReminder(userId, reminder) {
    // Mock scheduling - integrate with job queue (Bull/Agenda)
    const scheduledNotification = {
      userId,
      type: 'reminder',
      scheduledFor: reminder.scheduledFor,
      payload: {
        title: reminder.title,
        message: reminder.message,
        type: reminder.type
      },
      status: 'scheduled'
    };

    console.log(`⏰ REMINDER SCHEDULED:`, scheduledNotification);

    return {
      success: true,
      scheduledId: `reminder-${Date.now()}`,
      scheduledFor: reminder.scheduledFor
    };
  }

  async sendWeeklyReport(userId, reportData) {
    const report = {
      title: 'Your Weekly Pregnancy Report',
      message: `Week ${reportData.currentWeek}: ${reportData.summary}`,
      data: {
        week: reportData.currentWeek,
        completedTasks: reportData.completedTasks,
        upcomingAppointments: reportData.upcomingAppointments
      }
    };

    return await this.sendPushNotification(userId, report);
  }

  async sendEmergencyAlert(contacts, location, alertId) {
    const message = `EMERGENCY: MAMA user needs help. Location: ${location.lat}, ${location.lng}. Alert: ${alertId}`;
    
    const results = [];
    for (const contact of contacts) {
      if (contact.phone) {
        results.push(await this.sendSMS(contact.phone, message));
      }
    }

    return {
      totalSent: results.length,
      successful: results.filter(r => r.success).length
    };
  }

  async getNotificationPreferences(userId) {
    return {
      pushEnabled: true,
      smsEnabled: true,
      language: 'en',
      quietHours: { start: '22:00', end: '07:00' },
      categories: {
        appointments: true,
        medications: true,
        emergencies: true,
        educational: false
      }
    };
  }

  async updateNotificationPreferences(userId, preferences) {
    console.log(`⚙️ NOTIFICATION PREFERENCES UPDATED - ${userId}:`, preferences);
    
    return {
      success: true,
      updatedAt: new Date(),
      preferences
    };
  }

  isQuietHours(preferences) {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const startTime = parseInt(preferences.quietHours.start.replace(':', ''));
    const endTime = parseInt(preferences.quietHours.end.replace(':', ''));
    
    if (startTime > endTime) {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
    
    return currentTime >= startTime && currentTime <= endTime;
  }
}

export default new NotificationService();
import axios from 'axios';

class MnotifyService {
  constructor() {
    this.apiKey = process.env.MNOTIFY_API_KEY;
    this.senderId = process.env.MNOTIFY_SENDER_ID || 'MAMA';
    this.baseUrl = process.env.MNOTIFY_BASE_URL || 'https://api.mnotify.com/api';
  }

  async sendSMS(recipient, message) {
    try {
      const payload = {
        recipient: [recipient],
        sender: this.senderId,
        message: message,
        is_schedule: false,
        schedule_date: ''
      };

      const response = await axios.post(`${this.baseUrl}/sms/quick`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        messageId: response.data.message_id || `mnotify-${Date.now()}`,
        status: response.data.status,
        cost: response.data.cost || 0,
        response: response.data
      };
    } catch (error) {
      console.error('Mnotify SMS Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: 'failed'
      };
    }
  }

  async sendBulkSMS(recipients, message) {
    try {
      const payload = {
        recipient: recipients,
        sender: this.senderId,
        message: message,
        is_schedule: false,
        schedule_date: ''
      };

      const response = await axios.post(`${this.baseUrl}/sms/quick`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        messageId: response.data.message_id,
        totalRecipients: recipients.length,
        cost: response.data.cost,
        response: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async scheduleSMS(recipient, message, scheduleDate) {
    try {
      const payload = {
        recipient: [recipient],
        sender: this.senderId,
        message: message,
        is_schedule: true,
        schedule_date: scheduleDate
      };

      const response = await axios.post(`${this.baseUrl}/sms/quick`, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        messageId: response.data.message_id,
        scheduledFor: scheduleDate,
        response: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async checkBalance() {
    try {
      const response = await axios.get(`${this.baseUrl}/balance/sms`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        success: true,
        balance: response.data.balance,
        currency: response.data.currency || 'GHS'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  async getDeliveryReport(messageId) {
    try {
      const response = await axios.get(`${this.baseUrl}/sms/delivery-report/${messageId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return {
        success: true,
        report: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  formatGhanaianNumber(phoneNumber) {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('233')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return '233' + cleaned.substring(1);
    } else if (cleaned.length === 9) {
      return '233' + cleaned;
    }
    
    return cleaned;
  }
}

export default new MnotifyService();
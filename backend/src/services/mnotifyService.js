import 'dotenv/config';
import axios from 'axios';

class MnotifyService {
  constructor() {
    console.log('🔧 Environment check - MNOTIFY_API_KEY:', process.env.MNOTIFY_API_KEY ? 'Present' : 'Missing');
    console.log('🔧 Environment check - All SMS env vars:', {
      MNOTIFY_API_KEY: process.env.MNOTIFY_API_KEY ? 'Present' : 'Missing',
      MNOTIFY_BASE_URL: process.env.MNOTIFY_BASE_URL,
      SMS_SIMULATION_MODE: false
    });
    
    this.apiKey = process.env.MNOTIFY_API_KEY;
    this.senderId = 'MAMA APP';
    this.baseUrl = process.env.MNOTIFY_BASE_URL || 'https://api.mnotify.com/api';
    this.url = this.baseUrl + '/sms/quick?key=' + this.apiKey;
  }

  async sendSMS(recipient, message) {
    try {
      console.log('🔧 SMS Debug - API Key:', this.apiKey ? 'Present' : 'Missing');
      console.log('🔧 SMS Debug - Sender ID:', this.senderId);
      console.log('🔧 SMS Debug - Base URL:', this.baseUrl);
      console.log('🔧 SMS Debug - Recipient:', recipient);
      console.log('🔧 SMS Debug - Message:', message);

      const formattedRecipient = this.formatGhanaianNumber(recipient);
      console.log('🔧 SMS Debug - Formatted Recipient:', formattedRecipient);

      if (!this.apiKey || this.apiKey === 'your_valid_mnotify_api_key_here') {
        throw new Error('MNOTIFY_API_KEY is not configured');
      }

      const payload = {
        recipient: [formattedRecipient],
        sender: this.senderId,
        message: message,
        is_schedule: false,
        schedule_date: ''
      };

      console.log('🔧 SMS Debug - Payload:', JSON.stringify(payload, null, 2));

      const response = await axios.post(this.url, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      console.log('✅ SMS Success - Response:', response.data);

      return {
        success: true,
        messageId: response.data.message_id || `mnotify-${Date.now()}`,
        status: response.data.status,
        cost: response.data.cost || 0,
        response: response.data
      };
    } catch (error) {
      console.error('❌ Mnotify SMS Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        }
      });
      
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        status: 'failed',
        details: error.response?.data
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

      const response = await axios.post(this.url, payload, {
        headers: {
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

      const response = await axios.post(this.url, payload, {
        headers: {
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
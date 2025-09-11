import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EMERGENCY_CONTACT = '0543358413';

const sendEmergencyNotification = async (req, res) => {
  try {
    console.log('Emergency notification request:', req.body);
    const { audioBase64, textResponse, user, location } = req.body;

    if (!textResponse || !user) {
      return res.status(400).json({ error: 'Missing required data' });
    }

    // Format due date
    const dueDate = user.dueDate || user.pregnancyData?.dueDate;
    const formattedDueDate = dueDate ? new Date(dueDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Not specified';

    // Create Google Maps link if coordinates are provided
    const locationText = location && location.includes(',') 
      ? `https://maps.google.com/?q=${location}`
      : location || 'Location not available';

    // Send SMS with patient details
    const smsMessage = `🚨 EMERGENCY ALERT - MAMA APP\n\nPatient: ${user.name}\nPhone: ${user.phone}\nLocation: ${locationText}\nDue Date: ${formattedDueDate}\n\nAI Analysis: ${textResponse}\n\n⚠️ URGENT: Please contact patient immediately!`;

    const smsData = {
      recipient: [EMERGENCY_CONTACT],
      sender: 'TEAM K10',
      message: smsMessage,
      is_schedule: 'false',
      schedule_date: ''
    };

    const smsUrl = `${process.env.MNOTIFY_BASE_URL}/sms/quick?key=${process.env.MNOTIFY_API_KEY}`;
    console.log('Sending SMS to:', smsUrl);
    
    const smsResponse = await axios.post(smsUrl, smsData);
    console.log('SMS response:', smsResponse.data);

    // Send voice call if audio is available
    if (audioBase64) {
      try {
        console.log('Processing voice call with audio');
        
        // Convert base64 audio to file
        const audioBuffer = Buffer.from(audioBase64, 'base64');
        const audioPath = path.join(__dirname, '../../temp', `emergency_${Date.now()}.mp3`);
        
        // Ensure temp directory exists
        const tempDir = path.dirname(audioPath);
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        
        fs.writeFileSync(audioPath, audioBuffer);
        console.log('Audio file created:', audioPath);

        // Send voice call using MNotify
        const voiceData = new FormData();
        voiceData.append('campaign', 'MAMA AI APP');
        voiceData.append('recipient[]', EMERGENCY_CONTACT);
        voiceData.append('file', fs.createReadStream(audioPath));
        voiceData.append('is_schedule', 'false');
        voiceData.append('schedule_date', '');

        const voiceUrl = `${process.env.MNOTIFY_BASE_URL}/voice/quick?key=${process.env.MNOTIFY_API_KEY}`;
        console.log('Sending voice call to:', voiceUrl);
        
        const voiceResponse = await axios({
          method: 'post',
          url: voiceUrl,
          headers: voiceData.getHeaders(),
          data: voiceData
        });
        
        console.log('Voice call response:', voiceResponse.data);
        
        // Clean up temp file
        fs.unlinkSync(audioPath);
        
        res.json({ success: true, message: 'Emergency SMS and voice call sent successfully' });
      } catch (voiceError) {
        console.error('Voice call failed:', voiceError.response?.data || voiceError.message);
        res.json({ success: true, message: 'Emergency SMS sent successfully, voice call failed' });
      }
    } else {
      res.json({ success: true, message: 'Emergency SMS sent successfully' });
    }
  } catch (error) {
    console.error('Emergency notification error:', error.message);
    console.error('Error details:', error.response?.data || error.stack);
    res.status(500).json({ error: 'Failed to send emergency notification', details: error.message });
  }
};

export {
  sendEmergencyNotification
};
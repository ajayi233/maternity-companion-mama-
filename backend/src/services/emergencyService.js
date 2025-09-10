import clinicService from './clinicService.js';

class EmergencyService {
  async handleEmergencyAlert(userId, location, emergencyType = 'general') {
    const alertId = `EMG-${Date.now()}-${userId.slice(-4)}`;
    
    // Find nearest emergency facilities
    const nearestClinics = await clinicService.findNearbyClinicsByLocation(
      location.lat,
      location.lng,
      50, // 50km radius for emergencies
      ['emergency', 'delivery']
    );

    const emergencyResponse = {
      alertId,
      status: 'dispatched',
      timestamp: new Date(),
      location,
      nearestFacilities: nearestClinics.slice(0, 3),
      emergencyContacts: this.getEmergencyContacts(),
      instructions: this.getEmergencyInstructions(emergencyType),
      estimatedResponse: this.calculateResponseTime(location, nearestClinics[0])
    };

    // Log emergency for tracking and response
    await this.logEmergency(userId, emergencyResponse);

    // Notify emergency services (mock implementation)
    await this.notifyEmergencyServices(emergencyResponse);

    return emergencyResponse;
  }

  getEmergencyContacts() {
    return {
      ambulance: '+233-193',
      police: '+233-191',
      fire: '+233-192',
      nationalEmergency: '+233-911',
      maternalHotline: '+233-555-MAMA'
    };
  }

  getEmergencyInstructions(emergencyType) {
    const instructions = {
      general: [
        'Stay calm and breathe slowly',
        'If bleeding heavily, lie down and elevate legs',
        'Do not eat or drink anything',
        'Have someone stay with you',
        'Prepare identification and medical records'
      ],
      bleeding: [
        'Lie down immediately',
        'Elevate your legs',
        'Apply gentle pressure if external bleeding',
        'Call ambulance immediately',
        'Monitor consciousness'
      ],
      labor: [
        'Time your contractions',
        'Stay hydrated with small sips',
        'Find comfortable position',
        'Prepare hospital bag',
        'Call your birth partner'
      ],
      pain: [
        'Note pain location and intensity',
        'Avoid taking medications',
        'Try gentle breathing exercises',
        'Change positions slowly',
        'Monitor for other symptoms'
      ]
    };

    return instructions[emergencyType] || instructions.general;
  }

  calculateResponseTime(userLocation, nearestClinic) {
    if (!nearestClinic) {
      return { estimated: '20-30 minutes', confidence: 'low' };
    }

    const distance = nearestClinic.distance || 0;
    const baseTime = Math.max(10, distance * 2); // 2 minutes per km, minimum 10 minutes

    return {
      estimated: `${baseTime}-${baseTime + 10} minutes`,
      confidence: distance < 10 ? 'high' : 'medium',
      facility: nearestClinic.name
    };
  }

  async logEmergency(userId, emergencyData) {
    // Mock logging - integrate with actual emergency logging system
    console.log(`🚨 EMERGENCY LOG - ${emergencyData.alertId}`, {
      userId,
      timestamp: emergencyData.timestamp,
      location: emergencyData.location,
      status: emergencyData.status
    });

    // In production, this would save to emergency database
    return {
      logged: true,
      logId: emergencyData.alertId,
      timestamp: new Date()
    };
  }

  async notifyEmergencyServices(emergencyData) {
    // Mock notification - integrate with actual emergency dispatch system
    console.log(`📞 NOTIFYING EMERGENCY SERVICES - ${emergencyData.alertId}`);
    
    // Simulate API calls to emergency services
    const notifications = [
      { service: 'ambulance', status: 'notified', responseTime: '5-10 minutes' },
      { service: 'hospital', status: 'alerted', preparationTime: '2-3 minutes' }
    ];

    return {
      notificationsSent: notifications.length,
      services: notifications,
      timestamp: new Date()
    };
  }

  async getEmergencyHistory(userId, limit = 10) {
    // Mock emergency history - integrate with actual emergency database
    return {
      totalEmergencies: 0,
      recentAlerts: [],
      averageResponseTime: 'N/A',
      message: 'No emergency history found'
    };
  }

  async updateEmergencyStatus(alertId, status, notes = '') {
    console.log(`📋 EMERGENCY UPDATE - ${alertId}: ${status}`);
    
    return {
      alertId,
      status,
      notes,
      updatedAt: new Date(),
      success: true
    };
  }

  validateEmergencyLocation(location) {
    if (!location || !location.lat || !location.lng) {
      return { valid: false, error: 'Location coordinates required' };
    }

    // Basic Ghana coordinates validation
    const ghanaLatRange = [4.5, 11.5];
    const ghanaLngRange = [-3.5, 1.5];

    if (location.lat < ghanaLatRange[0] || location.lat > ghanaLatRange[1] ||
        location.lng < ghanaLngRange[0] || location.lng > ghanaLngRange[1]) {
      return { valid: false, error: 'Location outside Ghana coverage area' };
    }

    return { valid: true };
  }
}

export default new EmergencyService();
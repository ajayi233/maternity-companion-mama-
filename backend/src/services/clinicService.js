import Clinic from '../models/Clinic.js';

class ClinicService {
  async findNearbyClinicsByLocation(lat, lng, radius = 10, services = []) {
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000
        }
      },
      isActive: true
    };

    if (services.length > 0) {
      query.services = { $in: services };
    }

    const clinics = await Clinic.find(query).limit(20);
    
    return clinics.map(clinic => ({
      ...clinic.toObject(),
      distance: this.calculateDistance(lat, lng, clinic.location.coordinates[1], clinic.location.coordinates[0])
    }));
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 100) / 100; // Round to 2 decimal places
  }

  toRad(deg) {
    return deg * (Math.PI/180);
  }

  async getClinicRecommendations(userLocation, pregnancyWeek, urgency = 'normal') {
    const requiredServices = this.getRequiredServices(pregnancyWeek, urgency);
    const radius = urgency === 'emergency' ? 50 : 15;

    const clinics = await this.findNearbyClinicsByLocation(
      userLocation.lat,
      userLocation.lng,
      radius,
      requiredServices
    );

    return clinics
      .sort((a, b) => {
        if (urgency === 'emergency') {
          return a.distance - b.distance; // Closest first for emergencies
        }
        return b.rating - a.rating; // Highest rated first for normal visits
      })
      .slice(0, 10);
  }

  getRequiredServices(pregnancyWeek, urgency) {
    if (urgency === 'emergency') {
      return ['emergency', 'delivery'];
    }

    if (pregnancyWeek >= 36) {
      return ['delivery', 'prenatal'];
    }

    if (pregnancyWeek >= 18 && pregnancyWeek <= 22) {
      return ['ultrasound', 'prenatal'];
    }

    return ['prenatal'];
  }

  async searchClinicsByName(query, location = null) {
    const searchCriteria = {
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } }
      ],
      isActive: true
    };

    let clinics = await Clinic.find(searchCriteria).limit(50);

    if (location) {
      clinics = clinics.map(clinic => ({
        ...clinic.toObject(),
        distance: this.calculateDistance(
          location.lat,
          location.lng,
          clinic.location.coordinates[1],
          clinic.location.coordinates[0]
        )
      })).sort((a, b) => a.distance - b.distance);
    }

    return clinics;
  }

  async getClinicAvailability(clinicId, date) {
    // Mock availability - integrate with clinic booking systems
    const timeSlots = [
      '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
    ];

    const availableSlots = timeSlots.filter(() => Math.random() > 0.3);

    return {
      date,
      availableSlots,
      fullyBooked: availableSlots.length === 0
    };
  }
}

export default new ClinicService();
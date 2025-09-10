import Clinic from '../models/Clinic.js';

export const getNearbyclinics = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'Latitude and longitude are required' });
    }

    const clinics = await Clinic.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      },
      isActive: true
    }).limit(20);

    res.status(200).json({ success: true, count: clinics.length, data: clinics });
  } catch (error) {
    next(error);
  }
};

export const getClinicById = async (req, res, next) => {
  try {
    const clinic = await Clinic.findById(req.params.id);

    if (!clinic) {
      return res.status(404).json({ success: false, error: 'Clinic not found' });
    }

    res.status(200).json({ success: true, data: clinic });
  } catch (error) {
    next(error);
  }
};

export const searchClinics = async (req, res, next) => {
  try {
    const { query, services } = req.query;
    
    let searchCriteria = { isActive: true };

    if (query) {
      searchCriteria.name = { $regex: query, $options: 'i' };
    }

    if (services) {
      const serviceArray = services.split(',');
      searchCriteria.services = { $in: serviceArray };
    }

    const clinics = await Clinic.find(searchCriteria).limit(50);

    res.status(200).json({ success: true, count: clinics.length, data: clinics });
  } catch (error) {
    next(error);
  }
};
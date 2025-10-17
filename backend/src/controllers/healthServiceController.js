import HealthcareFacilitiesService from '../services/HealthcareFacilitiesService.js';
import dotenv from 'dotenv';

dotenv.config();
class HealthcareFacilitiesController {
  constructor() {
    this.healthcareService = new HealthcareFacilitiesService();
  }

  /**
   * Test endpoint to check if healthcare facilities service is working
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async testEndpoint(req, res) {
    try {
      // Default coordinates for testing (Ahodwo area)
      const testCoords = {
        latitude: 6.662732043,
        longitude: -1.623101234
      };
      
      const facilities = await this.healthcareService.getHealthcareFacilities(testCoords);
      
      return res.status(200).json({
        success: true,
        message: "Healthcare facilities endpoint is working",
        data: {
          facilitiesCount: facilities.length,
          facilities: facilities.slice(0, 5), // Return first 5 for brevity
          metadata: {
            apiStatus: "Operational",
            timestamp: new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error("Endpoint test failed:", error);
      
      return res.status(500).json({
        success: false,
        message: "Healthcare facilities endpoint test failed",
        error: error.message,
        metadata: {
          apiStatus: "Error",
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  /**
   * Get healthcare facilities by location
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getFacilities(req, res) {
    try {
      const { latitude, longitude, location } = req.query;
      
      let userCoords;
      
      if (latitude && longitude) {
        // Use provided coordinates
        userCoords = {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        };
      } else {
        // Fallback to default coordinates
        userCoords = {
          latitude: 6.662732043,
          longitude: -1.623101234
        };
      }
      

      console.log("🏥 [Backend] getFacilities called with query params:", req.query);
      console.log("🏥 [Backend] Processed params:", { userCoords, location });

      
      console.log("🏥 [Backend] Calling HealthcareFacilitiesService with:", { userCoords, location });
      const facilities = await this.healthcareService.getHealthcareFacilities(
        userCoords, 
        location
      );
      console.log("🏥 [Backend] Service returned", facilities.length, "facilities");
      
      return res.status(200).json({
        success: true,
        message: "Healthcare facilities retrieved successfully",
        data: {
          facilitiesCount: facilities.length,
          facilities: facilities,
          userLocation: userCoords,
          searchLocation: location || "Default"
        }
      });
    } catch (error) {
      console.error("Error fetching healthcare facilities:", error);
      
      return res.status(500).json({
        success: false,
        message: "Failed to fetch healthcare facilities",
        error: error.message
      });
    }
  }

  /**
   * Health check endpoint
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  healthCheck(req, res) {
    return res.status(200).json({
      success: true,
      message: "Healthcare Facilities API is running",
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    });
  }

  /**
   * Mock data endpoint for testing without API calls
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getMockFacilities(req, res) {
    const mockFacilities = [
      {
        name: "LaPetite Chemists Ltd",
        address: "Melcom Road, Kumasi",
        distance: "1.2 km",
        openTime: "Closes 9 PM",
        services: ["General Health", "Beauty Products", "Pet Medications"],
        specialties: [],
        direction: "https://maps.google.com/directions",
        call: "+233 20 005 5512",
        type: "Pharmacy"
      },
      {
        name: "Komfo Anokye Teaching Hospital",
        address: "Off Accra Road, Kumasi",
        distance: "3.5 km",
        openTime: "Open 24 hours",
        services: ["Emergency Care", "Maternity Services", "Pediatric Care"],
        specialties: ["Teaching Hospital"],
        direction: "https://maps.google.com/directions",
        call: "+233 32 202 0001",
        type: "Hospital"
      },
      {
        name: "Ahodwo Clinic",
        address: "Ahodwo Main Street",
        distance: "0.8 km",
        openTime: "Closes 6 PM",
        services: ["General Health", "Vaccinations"],
        specialties: [],
        direction: "https://maps.google.com/directions",
        call: "+233 50 123 4567",
        type: "Clinic"
      }
    ];

    return res.status(200).json({
      success: true,
      message: "Mock healthcare facilities data",
      data: {
        facilitiesCount: mockFacilities.length,
        facilities: mockFacilities,
        metadata: {
          dataType: "Mock",
          timestamp: new Date().toISOString()
        }
      }
    });
  }
}

export default HealthcareFacilitiesController;
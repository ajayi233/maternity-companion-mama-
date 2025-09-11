import { getJson } from "serpapi";

class HealthcareFacilitiesService {
  constructor() {
    this.apiKey = process.env.SERPAPI_KEY || "42693bae9212393505f2e7a2a14059a6231c0aaa6e62c87dac8b4bd7345e47b4";
    this.defaultLocation = process.env.DEFAULT_LOCATION || "Ahodwo, Ashanti Region, Ghana";
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {number} lat1 - Latitude of point 1
   * @param {number} lon1 - Longitude of point 1
   * @param {number} lat2 - Latitude of point 2
   * @param {number} lon2 - Longitude of point 2
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  /**
   * Parse opening hours from the API response
   * @param {string} hoursString - Hours string from API
   * @returns {string} Formatted opening hours
   */
  parseOpenTime(hoursString) {
    if (!hoursString) return "Unknown";
    
    if (hoursString.includes("Open ⋅ Closes")) {
      return hoursString.replace("Open ⋅ Closes", "Closes");
    } else if (hoursString.includes("Closes ⋅ Opens")) {
      return hoursString.replace("Closes ⋅ Opens", "Opens");
    }
    
    return hoursString;
  }

  /**
   * Extract services and specialties from description
   * @param {string} description - Description from API
   * @returns {Object} Object containing services and specialties
   */
  parseServicesAndSpecialties(description) {
    if (!description) return { services: [], specialties: [] };
    
    const services = [];
    const specialties = [];
    
    // Simple keyword-based parsing
    const keywords = {
      health: "General Health",
      beauty: "Beauty Products",
      pets: "Pet Medications",
      medicine: "Medicines",
      prescription: "Prescription Services",
      vaccine: "Vaccinations",
      emergency: "Emergency Care",
      maternity: "Maternity Services",
      pediatric: "Pediatric Care"
    };
    
    for (const [key, value] of Object.entries(keywords)) {
      if (description.toLowerCase().includes(key)) {
        services.push(value);
      }
    }
    
    return { services, specialties };
  }

  /**
   * Fetch healthcare facilities with static query
   * @param {Object} userCoords - User coordinates {latitude, longitude}
   * @param {string} location - Optional location override
   * @returns {Promise<Array>} Array of formatted facility objects
   */
  async getHealthcareFacilities(userCoords, location = null) {
    const searchLocation = location || this.defaultLocation;
    
    return new Promise((resolve, reject) => {
      getJson({
        engine: "google_local",
        q: "Pharmacy,Hospital,Clinic", // Static query as requested
        location: searchLocation,
        api_key: this.apiKey
      }, (json) => {
        if (json && json.error) {
          reject(json.error);
          return;
        }

        if (!json || !json.local_results || !json.local_results.places) {
          console.log(`No results found in ${searchLocation}`);
          resolve([]);
          return;
        }

        const facilities = json.local_results.places.map(place => {
          const { services, specialties } = this.parseServicesAndSpecialties(place.description);
          const distance = place.gps_coordinates 
            ? this.calculateDistance(
                userCoords.latitude, 
                userCoords.longitude,
                place.gps_coordinates.latitude,
                place.gps_coordinates.longitude
              )
            : "Unknown";
          
          return {
            name: place.title || "Unknown",
            address: place.address || "Address not available",
            distance: `${distance} km`,
            openTime: this.parseOpenTime(place.hours),
            services: services,
            specialties: specialties,
            direction: place.links?.directions || "",
            call: place.phone || "",
            type: place.type || this.determineType(place.title, place.description)
          };
        });

        resolve(facilities);
      });
    });
  }

  /**
   * Determine facility type based on title and description
   */
  determineType(title, description) {
    const lowerTitle = title ? title.toLowerCase() : "";
    const lowerDesc = description ? description.toLowerCase() : "";
    
    if (lowerTitle.includes("pharmacy") || lowerDesc.includes("pharmacy")) return "Pharmacy";
    if (lowerTitle.includes("hospital") || lowerDesc.includes("hospital")) return "Hospital";
    if (lowerTitle.includes("clinic") || lowerDesc.includes("clinic")) return "Clinic";
    
    return "Healthcare Facility";
  }
}

export default HealthcareFacilitiesService;
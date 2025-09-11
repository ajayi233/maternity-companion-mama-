import 'dotenv/config';
import HealthcareFacilitiesService from './HealthcareFaciltiesService.js';

// Initialize the service
const healthcareService = new HealthcareFacilitiesService();

// Test coordinates (Ahodwo area)
const userCoords = { 
  latitude: 6.662732043, 
  longitude: -1.623101234 
};

// Simple test function
async function testHealthcareService() {
  try {
    console.log("Testing healthcare service with static query...");
    console.log("API Key:", process.env.SERPAPI_KEY ? "Loaded" : "Not found");
    console.log("Default Location:", process.env.DEFAULT_LOCATION || "Using fallback");
    
    const facilities = await healthcareService.getHealthcareFacilities(userCoords);
    
    console.log(`\nFound ${facilities.length} healthcare facilities:`);
    
    if (facilities.length === 0) {
      console.log("No facilities found. This could be due to:");
      console.log("1. API key issues");
      console.log("2. No facilities in the specified location");
      console.log("3. Network connectivity issues");
      return;
    }
    
    facilities.forEach((facility, index) => {
      console.log(`\n${index + 1}. ${facility.name} (${facility.type})`);
      console.log(`   Address: ${facility.address}`);
      console.log(`   Distance: ${facility.distance}`);
      console.log(`   Open Time: ${facility.openTime}`);
      console.log(`   Phone: ${facility.call || "Not available"}`);
    });
    
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the test
testHealthcareService();
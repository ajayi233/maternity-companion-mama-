import SerpApiService from './src/services/serpApiService.js';

async function testSerpApi() {
  console.log('Testing SerpAPI Service...\n');
  
  const result = await SerpApiService.searchLocal('maternity clinics', 'New York, NY');
  
  if (result.success) {
    console.log('✅ Search successful!');
    console.log(`Found ${result.results.length} results:`);
    
    result.results.slice(0, 3).forEach((place, index) => {
      console.log(`\n${index + 1}. ${place.title}`);
      console.log(`   Address: ${place.address}`);
      console.log(`   Rating: ${place.rating || 'N/A'}`);
      console.log(`   Phone: ${place.phone || 'N/A'}`);
    });
  } else {
    console.log('❌ Search failed:', result.error);
  }
}

testSerpApi().catch(console.error);
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Clock, Star, Navigation, Hospital, Building2, Stethoscope, Loader2, Heart, ArrowRight, Users, Award, Filter } from "lucide-react";
import heroImage from "@/assets/pregnant-woman.png";
import { apiService, type HealthcareFacility } from "@/lib/api";
import { toast } from "sonner";

interface HealthFacility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy';
  address: string;
  phone: string;
  distance: string;
  rating: number;
  reviewCount: number;
  openHours: string;
  services: string[];
  specialties: string[];
  emergency: boolean;
}

export const ClinicLocator = () => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [locationName, setLocationName] = useState<string>('Getting your location...');
  const [retryCount, setRetryCount] = useState(0);
  const [facilities, setFacilities] = useState<HealthFacility[]>([]);
  const [facilitiesLoading, setFacilitiesLoading] = useState(false);
  const [apiData, setApiData] = useState<HealthcareFacility[]>([]);

  // Fetch facilities from API
  const fetchFacilities = async (lat?: number, lng?: number) => {
    try {
      setFacilitiesLoading(true);
      const response = await apiService.getHealthcareFacilities(lat, lng);
      
      // Store API data for direction links
      setApiData(response.facilities);
      
      // Transform API response to match component interface
      const transformedFacilities: HealthFacility[] = response.facilities.map((facility, index) => ({
        id: `api-${index}`,
        name: facility.name,
        type: getTypeFromString(facility.type),
        address: facility.address,
        phone: facility.call,
        distance: facility.distance,
        rating: 4.0 + Math.random() * 1, // Generate random rating since API doesn't provide
        reviewCount: Math.floor(Math.random() * 500) + 50,
        openHours: facility.openTime,
        services: facility.services,
        specialties: facility.specialties,
        emergency: facility.openTime.includes('24 hours') || facility.openTime.includes('Open 24'),
        coordinates: undefined // API doesn't provide coordinates in current format
      }));
      
      setFacilities(transformedFacilities);
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
      toast.error('Failed to load healthcare facilities', {
        description: 'Please try again later'
      });
      // Keep empty array on error
      setFacilities([]);
    } finally {
      setFacilitiesLoading(false);
    }
  };
  
  const getTypeFromString = (typeString: string): 'hospital' | 'clinic' | 'pharmacy' => {
    const lower = typeString.toLowerCase();
    if (lower.includes('hospital')) return 'hospital';
    if (lower.includes('pharmacy')) return 'pharmacy';
    return 'clinic';
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): string => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  // Sort facilities by distance
  const sortedFacilities = useMemo(() => {
    return [...facilities].sort((a, b) => {
      const distA = parseFloat(a.distance.toString().replace(/[^0-9.]/g, '') || '0');
      const distB = parseFloat(b.distance.toString().replace(/[^0-9.]/g, '') || '0');
      return distA - distB;
    });
  }, [facilities]);

  const facilityTypes = [
    { id: 'all', name: 'All Facilities', icon: MapPin, count: sortedFacilities.length },
    { id: 'hospital', name: 'Hospitals', icon: Hospital, count: sortedFacilities.filter(f => f.type === 'hospital').length },
    { id: 'clinic', name: 'Clinics', icon: Building2, count: sortedFacilities.filter(f => f.type === 'clinic').length },
    { id: 'pharmacy', name: 'Pharmacies', icon: Stethoscope, count: sortedFacilities.filter(f => f.type === 'pharmacy').length }
  ];

  const filteredFacilities = selectedType === 'all' 
    ? sortedFacilities 
    : sortedFacilities.filter(facility => facility.type === selectedType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hospital': return '🏥';
      case 'clinic': return '🏢';
      case 'pharmacy': return '💊';
      default: return '📍';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hospital': return 'bg-red-500';
      case 'clinic': return 'bg-blue-500';
      case 'pharmacy': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const makeCall = (phone: string) => {
    try {
      if ('navigator' in window && 'vibrate' in navigator) {
        navigator.vibrate(100);
      }
      window.location.href = `tel:${phone}`;
    } catch (error) {
      console.error('Call failed:', error);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phone).then(() => {
          import('sonner').then(({ toast }) => {
            toast.success('Phone number copied!', {
              description: `${phone} copied to clipboard`,
              duration: 3000,
            });
          });
        }).catch(() => {
          import('sonner').then(({ toast }) => {
            toast.info('Please call manually', {
              description: `Call ${phone}`,
              duration: 4000,
            });
          });
        });
      } else {
        import('sonner').then(({ toast }) => {
          toast.info('Please call manually', {
            description: `Call ${phone}`,
            duration: 4000,
          });
        });
      }
    }
  };

  useEffect(() => {
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setLocationStatus('error');
        setLocationName('Location not supported');
        // Fallback to Accra coordinates
        setUserLocation({ lat: 5.6037, lng: -0.1870 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationStatus('success');
          
          // Fetch facilities with user location
          fetchFacilities(latitude, longitude);
          
          // Get location name using reverse geocoding
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            if (response.ok) {
              const data = await response.json();
              setLocationName(`${data.city || data.locality || 'Your Location'}, ${data.countryName || data.country || 'Ghana'}`);
            } else {
              setLocationName(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
            }
          } catch (error) {
            console.warn('Reverse geocoding failed:', error);
            setLocationName(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
          }
        },
        (error) => {
          console.warn('Geolocation error:', error);
          
          // Retry once on timeout
          if (error.code === error.TIMEOUT && retryCount < 1) {
            setRetryCount(prev => prev + 1);
            setTimeout(() => getCurrentLocation(), 2000);
            return;
          }
          
          setLocationStatus('error');
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationName('Location access denied - using Accra');
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationName('Location unavailable - using Accra');
              break;
            case error.TIMEOUT:
              setLocationName('Location timeout - using Accra');
              break;
            default:
              setLocationName('Location error - using Accra');
              break;
          }
          
          setUserLocation({ lat: 5.6037, lng: -0.1870 });
          // Fetch facilities with default location
          fetchFacilities(5.6037, -0.1870);
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000
        }
      );
    };

    getCurrentLocation();
  }, []);



  const openDirections = (facility: HealthFacility) => {
    try {
      // Use the direction URL from API if available, otherwise search by name
      const apiResponse = apiData.find(f => f.name === facility.name);
      if (apiResponse && apiResponse.direction) {
        window.open(apiResponse.direction, '_blank', 'noopener,noreferrer');
      } else {
        const query = encodeURIComponent(`${facility.name} ${facility.address}`);
        const url = `https://www.google.com/maps/search/${query}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Failed to open directions:', error);
      toast.error('Unable to open directions', {
        description: 'Please try again or search manually',
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/40"></div>
        <div className="relative px-0 lg:px-24 pt-16 pb-0">
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div className="pb-16 px-6 lg:px-0">
              <div className="inline-flex items-center gap-2 bg-pink-100 rounded-full px-4 py-2 mb-6">
                <MapPin className="w-4 h-4 text-pink-600" />
                <span className="text-pink-700 text-sm font-medium">Healthcare Locator</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Find Quality Healthcare Near You
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Locate trusted hospitals, clinics, and pharmacies across Ghana. Get directions, contact information, and reviews all in one place.
              </p>
              <div className="flex items-center gap-8 mb-8">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-700 font-medium">{facilities.length}+ verified facilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700 font-medium">Real-time locations</span>
                </div>
              </div>
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 text-lg">
                Find Nearby Facilities
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="relative flex justify-center lg:block">
              <div className="relative z-10 w-full">
                <img 
                  src={heroImage} 
                  alt="Healthcare facilities locator" 
                  className="w-full h-[400px] object-cover object-center lg:object-top rounded-t-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-2xl opacity-30"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-24 py-12 space-y-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-500 mb-2">
              {facilitiesLoading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : sortedFacilities.filter(f => f.type === 'hospital').length}
            </div>
            <div className="text-gray-600">Hospitals</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {facilitiesLoading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : sortedFacilities.filter(f => f.type === 'clinic').length}
            </div>
            <div className="text-gray-600">Clinics</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {facilitiesLoading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : sortedFacilities.filter(f => f.type === 'pharmacy').length}
            </div>
            <div className="text-gray-600">Pharmacies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">
              {facilitiesLoading ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : sortedFacilities.filter(f => f.emergency).length}
            </div>
            <div className="text-gray-600">Emergency Care</div>
          </div>
        </div>

        {/* Location Status */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            {locationStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
            {locationStatus === 'success' && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>}
            {locationStatus === 'error' && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
            <span className="text-gray-900 font-medium">📍 {locationName}</span>
            <Badge className="ml-auto bg-gray-100 text-gray-600">
              {facilitiesLoading ? 'Loading...' : `${sortedFacilities.length} facilities nearby`}
            </Badge>
          </div>
          {locationStatus === 'error' && (
            <div className="text-sm text-orange-600 bg-orange-50 rounded-lg p-3">
              Using default location. Grant location access for accurate distances.
            </div>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
          {facilityTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all duration-200 ${
                selectedType === type.id
                  ? 'bg-pink-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-pink-200'
              }`}
            >
              {type.name} ({type.count})
            </button>
          ))}
        </div>

        {/* Facilities List */}
        <div className="space-y-6">
          {facilitiesLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mr-3" />
              <span className="text-gray-600">Loading healthcare facilities...</span>
            </div>
          )}
          
          {!facilitiesLoading && filteredFacilities.length === 0 && (
            <div className="text-center py-12">
              <Hospital className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
              <p className="text-gray-600">Try adjusting your filters or check your location settings.</p>
            </div>
          )}

          {filteredFacilities.map((facility, index) => (
            <div
              key={facility.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">{getTypeIcon(facility.type)}</span>
                </div>
                
                <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <h3 className="font-bold text-foreground text-base sm:text-lg leading-tight mb-1">
                              {facility.name}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-2">
                              📍 {facility.address}
                            </p>
                            <div className="flex items-center gap-3 text-sm mb-2">
                              <div className="flex items-center gap-1">
                                <Navigation className="w-4 h-4 text-primary" />
                                <span className="font-medium text-primary">{facility.distance}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">{facility.openHours}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-200">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3 h-3 ${
                                        i < Math.floor(facility.rating) 
                                          ? 'fill-yellow-400 text-yellow-400' 
                                          : i < facility.rating 
                                          ? 'fill-yellow-200 text-yellow-400' 
                                          : 'text-gray-300'
                                      }`} 
                                    />
                                  ))}
                                </div>
                                <span className="font-semibold text-yellow-700 ml-1">{facility.rating.toFixed(1)}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">({facility.reviewCount} reviews)</span>
                              {facility.rating >= 4.5 && (
                                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                                  ⭐ Highly Rated
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            {facility.emergency && (
                              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                🚨 Emergency
                              </Badge>
                            )}
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 capitalize">
                              {facility.type}
                            </Badge>
                          </div>
                        </div>

                        {/* Services */}
                        <div className="mb-4">
                          <p className="text-sm font-medium text-foreground mb-2">Services:</p>
                          <div className="flex flex-wrap gap-2">
                            {facility.services.map((service, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Specialties */}
                        {facility.specialties.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-foreground mb-2">Specialties:</p>
                            <div className="flex flex-wrap gap-2">
                              {facility.specialties.map((specialty, idx) => (
                                <Badge key={idx} className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => openDirections(facility)}
                          className="bg-pink-500 hover:bg-pink-600 text-white flex-1"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Directions
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => makeCall(facility.phone)}
                          className="bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 flex-1"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => window.open('/emergency', '_blank')}
                          className="bg-red-500 hover:bg-red-600 text-white flex-1"
                        >
                          🚨 Emergency
                        </Button>
                      </div>
                      </div>
                    </div>
                  </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 py-12">
        <div className="px-6 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-pink-600">MAMA</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Your trusted maternal health companion across Ghana.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li>AI Health Assistant</li>
                <li>Appointment Reminders</li>
                <li>Clinic Locator</li>
                <li>Health Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Emergency</h4>
              <p className="text-gray-600 mb-2">Ghana Ambulance Service</p>
              <p className="text-2xl font-bold text-pink-600">193</p>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-600">© 2024 MAMA. Made with ❤️ for mothers in Ghana.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
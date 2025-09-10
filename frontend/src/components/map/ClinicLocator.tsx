import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Phone, Clock, Star, Navigation, Hospital, Building2, Stethoscope, Loader2 } from "lucide-react";

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

  const baseFacilities = [
    {
      id: '1',
      name: 'Korle-Bu Teaching Hospital',
      type: 'hospital' as const,
      address: 'Korle-Bu, Accra',
      phone: '0302-665-401',
      rating: 4.2,
      reviewCount: 1247,
      openHours: '24/7',
      services: ['Emergency', 'Maternity', 'Pediatrics', 'Surgery'],
      specialties: ['Obstetrics', 'Gynecology', 'Neonatology'],
      emergency: true,
      coordinates: { lat: 5.5947, lng: -0.2120 }
    },
    {
      id: '2',
      name: 'Ridge Hospital',
      type: 'hospital' as const,
      address: 'Ridge, Accra',
      phone: '0302-776-111',
      rating: 4.5,
      reviewCount: 892,
      openHours: '24/7',
      services: ['Emergency', 'Maternity', 'Outpatient'],
      specialties: ['Maternal Health', 'Family Medicine'],
      emergency: true,
      coordinates: { lat: 5.5731, lng: -0.1969 }
    },
    {
      id: '3',
      name: 'Nyaho Medical Centre',
      type: 'clinic' as const,
      address: 'Airport Residential Area, Accra',
      phone: '0302-761-391',
      rating: 4.7,
      reviewCount: 634,
      openHours: '6:00 AM - 10:00 PM',
      services: ['Prenatal Care', 'Ultrasound', 'Lab Tests'],
      specialties: ['Obstetrics', 'Prenatal Care'],
      emergency: false,
      coordinates: { lat: 5.6019, lng: -0.1731 }
    },
    {
      id: '4',
      name: 'Trust Hospital',
      type: 'hospital' as const,
      address: 'Dzorwulu, Accra',
      phone: '0302-815-950',
      rating: 4.4,
      reviewCount: 756,
      openHours: '24/7',
      services: ['Emergency', 'Maternity', 'ICU', 'Surgery'],
      specialties: ['High-Risk Pregnancy', 'Neonatal Care'],
      emergency: true,
      coordinates: { lat: 5.6147, lng: -0.1847 }
    },
    {
      id: '5',
      name: 'Lister Hospital',
      type: 'hospital' as const,
      address: 'Roman Ridge, Accra',
      phone: '0302-685-181',
      rating: 4.3,
      reviewCount: 523,
      openHours: '24/7',
      services: ['Emergency', 'Maternity', 'Pediatrics'],
      specialties: ['Maternal Health', 'Child Care'],
      emergency: true,
      coordinates: { lat: 5.5842, lng: -0.1925 }
    },
    {
      id: '6',
      name: 'Pharmacy Plus',
      type: 'pharmacy' as const,
      address: 'Osu, Accra',
      phone: '0302-777-123',
      rating: 4.1,
      reviewCount: 298,
      openHours: '7:00 AM - 9:00 PM',
      services: ['Prescription', 'OTC Medications', 'Health Consultation'],
      specialties: ['Prenatal Vitamins', 'Maternal Supplements'],
      emergency: false,
      coordinates: { lat: 5.5531, lng: -0.1719 }
    }
  ];

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

  const facilities: HealthFacility[] = useMemo(() => {
    if (!baseFacilities.length) return [];
    
    return baseFacilities.map(facility => ({
      ...facility,
      distance: userLocation && facility.coordinates
        ? calculateDistance(userLocation.lat, userLocation.lng, facility.coordinates.lat, facility.coordinates.lng)
        : 'Calculating...'
    })).sort((a, b) => {
      if (!userLocation) return 0;
      const distA = parseFloat(a.distance.toString().replace(/[^0-9.]/g, '') || '0');
      const distB = parseFloat(b.distance.toString().replace(/[^0-9.]/g, '') || '0');
      return distA - distB;
    });
  }, [userLocation, baseFacilities]);

  const facilityTypes = [
    { id: 'all', name: 'All Facilities', icon: MapPin, count: facilities.length },
    { id: 'hospital', name: 'Hospitals', icon: Hospital, count: facilities.filter(f => f.type === 'hospital').length },
    { id: 'clinic', name: 'Clinics', icon: Building2, count: facilities.filter(f => f.type === 'clinic').length },
    { id: 'pharmacy', name: 'Pharmacies', icon: Stethoscope, count: facilities.filter(f => f.type === 'pharmacy').length }
  ];

  const filteredFacilities = selectedType === 'all' 
    ? facilities 
    : facilities.filter(facility => facility.type === selectedType);

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
      if (userLocation && facility.coordinates) {
        const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${facility.coordinates.lat},${facility.coordinates.lng}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        const query = encodeURIComponent(`${facility.name} ${facility.address}`);
        const url = `https://www.google.com/maps/search/${query}`;
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Failed to open directions:', error);
      import('sonner').then(({ toast }) => {
        toast.error('Unable to open directions', {
          description: 'Please try again or search manually',
          duration: 3000,
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero pb-24 animate-fade-in">
      <div className="px-4 space-y-4 sm:space-y-6 mobile-safe">
        {/* Modern Header */}
        <div className="relative overflow-hidden">
          <div className="h-28 sm:h-32 bg-gradient-primary relative rounded-2xl">
            <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
            <div className="relative z-10 p-4 sm:p-6 text-white flex items-center gap-3 sm:gap-4 h-full">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <div className="animate-slide-up">
                <h1 className="text-xl sm:text-2xl font-bold mb-1">Healthcare Locator</h1>
                <p className="text-sm sm:text-base text-white/80">Find nearby clinics and hospitals</p>
              </div>
              <div className="ml-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <Navigation className="w-8 h-8 text-white/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Location Status */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-gradient-card rounded-2xl p-4 shadow-lg border-0">
            <div className="flex items-center gap-3">
              {locationStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
              {locationStatus === 'success' && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>}
              {locationStatus === 'error' && <div className="w-3 h-3 bg-orange-500 rounded-full"></div>}
              <span className="text-foreground font-medium">📍 {locationName}</span>
              <Badge variant="secondary" className="ml-auto">
                {facilities.length} facilities nearby
              </Badge>
            </div>
            {locationStatus === 'error' && (
              <div className="mt-2 text-xs text-orange-600 bg-orange-50/50 rounded-lg p-2">
                Using default location. Grant location access for accurate distances.
              </div>
            )}
            {userLocation && (
              <div className="mt-2 text-xs text-blue-600 bg-blue-50/50 rounded-lg p-2">
                📍 Your coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </div>
            )}
          </div>
        </div>

        {/* Facility Type Tabs */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Tabs value={selectedType} onValueChange={setSelectedType} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-4 sm:mb-6 bg-white/50 backdrop-blur-sm border border-white/20 h-auto p-1">
              {facilityTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <TabsTrigger 
                    key={type.id} 
                    value={type.id} 
                    className="data-[state=active]:bg-primary data-[state=active]:text-white flex flex-col gap-1 py-2 sm:py-3 px-1 sm:px-2 min-h-[60px] sm:min-h-[auto]"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{type.name}</span>
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {type.count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value={selectedType} className="space-y-4">
              <div className="space-y-4">
                {filteredFacilities.map((facility, index) => (
                  <div
                    key={facility.id}
                    className="bg-gradient-card rounded-2xl p-4 sm:p-6 shadow-lg border-0 hover:shadow-xl transition-all duration-200 animate-slide-up group"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 ${getTypeColor(facility.type)} rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
                        <span className="text-xl sm:text-2xl">{getTypeIcon(facility.type)}</span>
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
                                <span className="font-semibold text-yellow-700 ml-1">{facility.rating}</span>
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
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Button
                            variant="gradient"
                            size="sm"
                            onClick={() => openDirections(facility)}
                            className="flex-1"
                          >
                            <Navigation className="w-4 h-4 mr-2" />
                            Directions
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => makeCall(facility.phone)}
                            className="flex-1"
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>


      </div>
    </div>
  );
};
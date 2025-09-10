import { useMemo, useState } from "react";
import { PregnancyProgress } from "./PregnancyProgress";
import { AIPregnancyGuide } from "@/components/ai/AIPregnancyGuide";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Heart, Star, Quote, Shield, Users, Clock } from "lucide-react";
import heroImage from "@/assets/pregnant-woman.png";

interface DashboardProps {
  user: {
    name: string;
    dueDate?: string;
  };
  onNavigate: (tab: string) => void;
  onLogout?: () => void;
}

export const Dashboard = ({ user, onNavigate, onLogout }: DashboardProps) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const testimonials = useMemo(() => [
    {
      name: "Ama Osei",
      location: "Tamale",
      text: "Finding nearby clinics was so easy. MAMA made my pregnancy stress-free and beautiful.",
      rating: 5
    },
    {
      name: "Akosua Mensah",
      location: "Accra",
      text: "MAMA helped me through my entire pregnancy. The AI assistant answered all my questions, even at 2am!",
      rating: 5
    },
    {
      name: "Efua Asante",
      location: "Kumasi", 
      text: "The reminders kept me on track with all my appointments. I felt so supported throughout my journey.",
      rating: 5
    }
  ], []);

  const upcomingReminders = useMemo(() => [
    { id: 1, title: "Take prenatal vitamins", time: "9:00 AM", type: "medication" },
    { id: 2, title: "Doctor appointment", time: "Tomorrow 2:00 PM", type: "appointment" },
    { id: 3, title: "Weekly weight check", time: "This Friday", type: "checkup" }
  ], []);

  return (
    <div className="min-h-screen bg-gradient-hero pb-24 lg:pb-0 page-enter relative z-0">
      {/* Hero Section */}
      <div className="px-6 lg:px-24 mt-6 relative z-10">
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Content Section */}
            <div className="p-8 lg:p-12 order-1 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 mb-6 w-fit">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">Welcome {user.name.split(' ')[0]}!</span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-gray-900 leading-tight">
                Welcome to MAMA! 🤱
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Your trusted maternal health companion designed specifically for mothers in Ghana. Get personalized care, expert guidance, and 24/7 AI support throughout your pregnancy journey.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => onNavigate('chat')}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2 justify-center"
                >
                  <Heart className="w-5 h-5" />
                  Chat with AI Assistant
                </button>
                <button
                  onClick={() => onNavigate('resources')}
                  className="border-2 border-pink-500 text-pink-500 hover:bg-pink-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2 justify-center"
                >
                  <Bell className="w-5 h-5" />
                  Explore Resources
                </button>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>Trusted by 10,000+ mothers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
            
            {/* Image Section */}
            <div className="relative h-[300px] lg:h-[600px] order-1 lg:order-2">
              <img 
                src={heroImage} 
                alt="Maternal health companion" 
                className="w-full h-full object-cover object-top"
              />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20"></div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-12 mt-6 space-y-6 relative z-30">
        {/* AI Pregnancy Guide */}
        <div className="card-enter px-6 lg:px-24">
          <AIPregnancyGuide dueDate={user.dueDate} />
        </div>



        {/* About Section */}
        <div className="card-enter py-16" style={{ animationDelay: '0.2s' }}>
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Section */}
              <div className="relative h-64 lg:h-auto">
                <img 
                  src={heroImage} 
                  alt="MAMA - Maternal Health Companion" 
                  className="w-full h-[300px] lg:h-[650px] object-cover object-top"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20"></div> */}
              </div>
              
              {/* Content Section */}
              <div className="p-8 lg:p-12 mt-12 lg:mt-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">About MAMA</h2>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  MAMA is Ghana's leading maternal health companion, designed specifically for expectant mothers across the country. Our AI-powered platform provides personalized care, expert guidance, and 24/7 support throughout your pregnancy journey.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Evidence-Based Care</h3>
                      <p className="text-gray-600">Trusted medical guidance from certified healthcare professionals and WHO guidelines</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Users className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Community Support</h3>
                      <p className="text-gray-600">Connect with thousands of mothers across Ghana sharing similar experiences</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Always Available</h3>
                      <p className="text-gray-600">AI assistant ready to answer questions and provide support anytime, anywhere</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-pink-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Who is MAMA for?</h4>
                  <p className="text-gray-700">
                    Expectant mothers, new mothers, and families in Ghana seeking reliable, culturally-sensitive maternal health support with easy access to healthcare resources and emergency services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="card-enter py-12 px-6 lg:px-24" style={{ animationDelay: '0.3s' }}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by mothers across Ghana</h2>
            <p className="text-gray-600 text-lg">Join thousands of expectant mothers who trust MAMA for their pregnancy journey</p>
          </div>
          {/* Mobile - Single testimonial */}
          <div className="lg:hidden">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
              <Quote className="w-8 h-8 text-pink-500 mb-4" />
              <p className="text-gray-800 text-lg leading-relaxed mb-6 font-medium">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</p>
                  <p className="text-gray-600 text-sm">{testimonials[currentTestimonial].location}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-center">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-pink-500 w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop - Three testimonials */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 min-h-[200px] flex flex-col justify-between">
                <Quote className="w-6 h-6 text-pink-500 mb-4" />
                <p className="text-gray-800 text-base leading-relaxed mb-4 font-medium">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.location}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-12 py-8">
        <div className="px-4 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-pink-600">MAMA</span>
              </div>
              <p className="text-sm text-muted-foreground">Your trusted maternal health companion across Ghana.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>AI Health Assistant</li>
                <li>Appointment Reminders</li>
                <li>Clinic Locator</li>
                <li>Health Resources</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Emergency</h4>
              <p className="text-sm text-muted-foreground mb-2">Ghana Ambulance Service</p>
              <p className="text-lg font-bold text-pink-600">193</p>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-6 text-center">
            <p className="text-sm text-muted-foreground">© 2024 MAMA. Made with ❤️ for mothers in Ghana.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
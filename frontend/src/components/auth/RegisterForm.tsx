import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Lock, Calendar, Heart, ArrowRight, ArrowLeft, Star, Quote } from "lucide-react";
import { apiService } from "@/lib/api";

interface RegisterFormProps {
  onRegister: (userData: {
    name: string;
    phone: string;
    password: string;
    dueDate: string;
  }) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm = ({ onRegister, onSwitchToLogin }: RegisterFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dueDate: ""
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (!formData.name || !formData.phone || !formData.dueDate) {
      import('sonner').then(({ toast }) => {
        toast.error('Please fill all fields', {
          description: 'Complete all fields to continue.',
          duration: 3000,
        });
      });
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      import('sonner').then(({ toast }) => {
        toast.error('Passwords do not match', {
          description: 'Please make sure both passwords are identical.',
          duration: 4000,
        });
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      onRegister({
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        dueDate: formData.dueDate
      });
      setLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const testimonials = [
    {
      name: "Adwoa Boateng",
      location: "Cape Coast",
      text: "MAMA made my first pregnancy so much easier. The personalized reminders and 24/7 support were incredible!",
      rating: 5
    },
    {
      name: "Abena Frimpong",
      location: "Ho", 
      text: "I loved how MAMA connected me with other expecting mothers. The community support was amazing.",
      rating: 5
    },
    {
      name: "Yaa Asiedu",
      location: "Sunyani",
      text: "The AI assistant helped me understand every stage of my pregnancy. I felt confident and prepared.",
      rating: 5
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Testimonial Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-rose-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-pink-600">MAMA</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Start your beautiful journey to motherhood
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Join our caring community and get personalized support every step of the way.
            </p>
          </div>

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
      </div>

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-pink-600">MAMA</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Join Our Community</h1>
            <p className="text-gray-600">Start your maternal health journey</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentStep === 1 ? 'Create your account' : 'Secure your account'}
            </h2>
            <p className="text-gray-600">
              {currentStep === 1 ? 'Tell us about yourself' : 'Set up your password'} • Step {currentStep} of 2
            </p>
          </div>

          {currentStep === 1 ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0241234567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                  Expected Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                  required
                />
              </div>
              
              <Button 
                onClick={handleNext}
                variant="gradient"
                className="w-full h-12 font-semibold rounded-xl"
              >
                Continue <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  variant="outline"
                  className="flex-1 h-12 border-2 border-gray-200 hover:border-pink-500 text-gray-700 hover:text-pink-600 font-semibold rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  className="flex-1 h-12 font-semibold rounded-xl"
                  disabled={loading}
                  onClick={async () => {
                    await apiService.register({
                      name: formData.name,
                      phone: formData.phone,
                      password: formData.password,
                      dueDate: formData.dueDate,
                    });
                  }}
                >
                  {loading ? "Creating..." : "Create Account"}
              </Button>

              </div>
            </form>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Already have an account?
            </p>
            <Button 
              variant="outline" 
              onClick={onSwitchToLogin}
              className="w-full h-12 border-2 border-gray-200 hover:border-pink-500 text-gray-700 hover:text-pink-600 font-semibold rounded-xl transition-all duration-200"
            >
              Sign In Instead
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
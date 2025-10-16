import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Lock, Heart, Star, Quote } from "lucide-react";
import { apiService } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onLogin?: (phone: string, password: string) => void;
  onSwitchToRegister: () => void;
  onForgotPassword: () => void;
}

interface LoginResponse{
  user: any;
  accessToken: string;
  refreshToken: string;
}

export const LoginForm = ({ onLogin, onSwitchToRegister, onForgotPassword }: LoginFormProps) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (onLogin) {
        await onLogin(phone, password);
      } else {
        // Fallback to direct API call if onLogin not provided
        const data: LoginResponse = await apiService.login({phone, password});
        setAccessToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('mama_user', JSON.stringify(data.user));
        console.log('Login successful:', data.user);
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
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
    },
    {
      name: "Ama Osei",
      location: "Tamale",
      text: "Finding nearby clinics was so easy. MAMA made my pregnancy stress-free and beautiful.",
      rating: 5
    }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Testimonial Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 p-12 flex-col justify-center items-center relative overflow-hidden">
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
              Your trusted companion for a healthy pregnancy
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Join thousands of expectant mothers across Ghana who trust MAMA for personalized care and support.
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

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-12 py-8 lg:px-16 lg:py-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-pink-600">MAMA</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Continue your maternal health journey</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back.</h2>
            <p className="text-gray-600">Please sign into your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0241234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-gray-200 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              variant="gradient"
              className="w-full h-12 font-semibold rounded-xl"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="text-center mt-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onForgotPassword}
              className="text-pink-600 hover:text-pink-700 font-medium"
            >
              Forgot Password?
            </Button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Don't have an account?
            </p>
            <Button 
              variant="outline" 
              onClick={onSwitchToRegister}
              className="w-full h-12 border-2 border-gray-200 hover:border-pink-500 text-gray-700 hover:text-pink-600 font-semibold rounded-xl transition-all duration-200"
            >
              Create New Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
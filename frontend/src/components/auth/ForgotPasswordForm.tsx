import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone, Heart, ArrowLeft, Star, Quote } from "lucide-react";
import { apiService } from "@/lib/api";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
  onResetSent: (phone: string) => void;
}

export const ForgotPasswordForm = ({ onBackToLogin, onResetSent }: ForgotPasswordFormProps) => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await apiService.forgotPassword(phone);
      onResetSent(phone);
      
      import('sonner').then(({ toast }) => {
        toast.success('Reset code sent', {
          description: 'Check your phone for the 6-digit code',
          duration: 4000,
        });
      });
    } catch (error: any) {
      import('sonner').then(({ toast }) => {
        toast.error('Failed to send reset code', {
          description: error.message || 'Please try again',
          duration: 3000,
        });
      });
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
    {
      name: "Gifty Owusu",
      location: "Tema",
      text: "When I forgot my password during my third trimester, MAMA's quick reset process got me back to my health tracking instantly!",
      rating: 5
    },
    {
      name: "Maame Serwaa",
      location: "Koforidua", 
      text: "The secure password reset gave me peace of mind. MAMA truly cares about protecting our personal health information.",
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
              Don't worry, we've got you covered
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Securely reset your password and get back to your maternal health journey.
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

      {/* Right Side - Form */}
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">We'll help you get back in</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot your password?</h2>
            <p className="text-gray-600">Enter your phone number to receive a reset code</p>
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
            
            <Button 
              type="submit" 
              variant="gradient"
              className="w-full h-12 font-semibold rounded-xl"
              disabled={loading}
            >
              {loading ? "Sending Code..." : "Send Reset Code"}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <Button 
              variant="ghost" 
              onClick={onBackToLogin}
              className="flex items-center gap-2 mx-auto text-gray-600 hover:text-pink-600 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { apiService } from "@/lib/api";

// Components
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { AIChatInterface } from "@/components/chat/AIChatInterface";
import { TextChat } from "@/components/chat/TextChat";
import { RemindersView } from "@/components/reminders/RemindersView";
import { EducationalResources } from "@/components/resources/EducationalResources";
import { ClinicLocator } from "@/components/map/ClinicLocator";
import { LiveVoiceChat } from "@/components/ai/LiveVoiceChat";
import { VideoCallAI } from "@/components/ai/VideoCallAI";
import { VirtualAIAssistant } from "@/components/ai/VirtualAIAssistant";
import { SymptomChecker } from "@/components/ai/SymptomChecker";
import { MultilingualChat } from "@/components/ai/MultilingualChat";
import { PersonalizedReminders } from "@/components/ai/PersonalizedReminders";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { EmergencyButton } from "@/components/dashboard/EmergencyButton";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

interface User {
  name: string;
  phone: string;
  dueDate?: string;
}

// Main App Component with Routing
const MainApp = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
  const [resetPhone, setResetPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user session on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('mama_user');
        
        if (accessToken && savedUser) {
          try {
            const userData = JSON.parse(savedUser);
            // Try to validate token with backend
            const profileData = await apiService.getProfile();
            setUser(profileData.user);
          } catch (error) {
            console.error('Token validation failed:', error);
            // Clear invalid tokens
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('mama_user');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error loading user session:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const handleLogin = async (phone: string, password: string) => {
    if (!phone || !password) {
      import('sonner').then(({ toast }) => {
        toast.error('Missing credentials', {
          description: 'Please enter both phone and password',
          duration: 3000,
        });
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await apiService.login({ phone: phone.trim(), password });
      setUser(data.user);
      navigate('/');
      
      import('sonner').then(({ toast }) => {
        toast.success('Login successful', {
          description: `Welcome back, ${data.user.name}!`,
          duration: 3000,
        });
      });
    } catch (error: any) {
      console.error('Login error:', error);
      import('sonner').then(({ toast }) => {
        toast.error('Login failed', {
          description: error.message || 'Please check your credentials',
          duration: 3000,
        });
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (userData: { name: string; phone: string; password: string; dueDate: string }) => {
    if (!userData.name || !userData.phone || !userData.password || !userData.dueDate) {
      import('sonner').then(({ toast }) => {
        toast.error('Missing information', {
          description: 'Please fill in all required fields',
          duration: 3000,
        });
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await apiService.register({
        name: userData.name.trim(),
        phone: userData.phone.trim(),
        password: userData.password,
        dueDate: userData.dueDate
      });
      
      setUser(data.user);
      navigate('/');
      
      import('sonner').then(({ toast }) => {
        toast.success('Registration successful', {
          description: `Welcome to MAMA, ${data.user.name}!`,
          duration: 3000,
        });
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      import('sonner').then(({ toast }) => {
        toast.error('Registration failed', {
          description: error.message || 'Please try again',
          duration: 3000,
        });
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setAuthState('login');
      navigate('/');
      
      import('sonner').then(({ toast }) => {
        toast.success('Logged out successfully', {
          duration: 2000,
        });
      });
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      setAuthState('login');
      navigate('/');
    }
  };

  const handleNavigate = (tab: string) => {
    switch (tab) {
      case 'home':
        navigate('/');
        break;
      case 'reminders':
        navigate('/reminders');
        break;
      case 'chat':
        navigate('/chat');
        break;
      case 'voice-chat':
        navigate('/voice-chat');
        break;
      case 'resources':
        navigate('/resources');
        break;
      case 'map':
        navigate('/map');
        break;
      default:
        navigate('/');
    }
  };

  const getActiveTab = () => {
    switch (location.pathname) {
      case '/chat':
        return 'chat';
      case '/voice-chat':
        return 'voice-chat';
      case '/resources':
        return 'resources';
      case '/map':
        return 'map';
      default:
        return 'home';
    }
  };

  // Debug logging
  useEffect(() => {
    console.log('Auth state:', { user: !!user, isLoading, pathname: location.pathname });
  }, [user, isLoading, location.pathname]);

  // Show loading screen only briefly
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="text-2xl">🤱</div>
          </div>
          <div className="text-white font-medium">Loading MAMA...</div>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show auth forms
  if (!user) {
    return (
      <div className="min-h-screen">
        {authState === 'register' && (
          <RegisterForm 
            onRegister={handleRegister} 
            onSwitchToLogin={() => setAuthState('login')} 
          />
        )}
        {authState === 'login' && (
          <LoginForm 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setAuthState('register')}
            onForgotPassword={() => setAuthState('forgot')}
          />
        )}
        {authState === 'forgot' && (
          <ForgotPasswordForm 
            onBackToLogin={() => setAuthState('login')}
            onResetSent={(phone) => {
              setResetPhone(phone);
              setAuthState('reset');
            }}
          />
        )}
        {authState === 'reset' && (
          <ResetPasswordForm 
            phone={resetPhone}
            onPasswordReset={() => {
              import('sonner').then(({ toast }) => {
                toast.success('Password reset successful!', {
                  description: 'Please sign in with your new password.',
                  duration: 4000,
                });
              });
              setAuthState('login');
            }}
            onBackToForgot={() => setAuthState('forgot')}
          />
        )}
      </div>
    );
  }

  // If user is authenticated, show main app with routes
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Dashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} />} />
        <Route path="/reminders" element={
          <div className="pb-24">
            <RemindersView />
          </div>
        } />
        <Route path="/chat" element={
          <div className="pb-24">
            <TextChat />
          </div>
        } />
        <Route path="/voice-chat" element={
          <div className="pb-24">
            <LiveVoiceChat />
          </div>
        } />
        <Route path="/ai-symptom-checker" element={
          <div className="min-h-screen bg-gradient-hero pb-24 pt-6">
            <div className="px-4">
              <SymptomChecker />
            </div>
          </div>
        } />
        <Route path="/multilingual-chat" element={
          <div className="min-h-screen bg-gradient-hero pb-24 pt-6">
            <div className="px-4">
              <MultilingualChat />
            </div>
          </div>
        } />
        <Route path="/personalized-reminders" element={
          <div className="min-h-screen bg-gradient-hero pb-24 pt-6">
            <div className="px-4">
              <PersonalizedReminders />
            </div>
          </div>
        } />
        <Route path="/resources" element={
          <div className="pb-24">
            <EducationalResources />
          </div>
        } />
        <Route path="/map" element={
          <div className="pb-24">
            <ClinicLocator />
          </div>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNavigation activeTab={getActiveTab()} onTabChange={handleNavigate} />
      <EmergencyButton />

    </div>
  );
};

// Root App Component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
          className: 'rounded-xl shadow-lg backdrop-blur-sm',
        }}
      />
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

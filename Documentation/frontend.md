# Frontend Documentation - MAMA Health Platform

## Architecture Overview

The MAMA frontend is a modern React application built with TypeScript, providing an intuitive and responsive user interface for expectant mothers in Ghana. The application follows a component-based architecture with a mobile-first design approach.

## Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | React | ^18.3.1 | UI library for building user interfaces |
| **Language** | TypeScript | ^5.8.3 | Type-safe JavaScript development |
| **Build Tool** | Vite | ^6.3.6 | Fast development and build tooling |
| **Styling** | Tailwind CSS | ^3.4.17 | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Latest | Pre-built accessible components |
| **State Management** | React Query | ^5.83.0 | Server state management |
| **Routing** | React Router | ^6.30.1 | Client-side routing |
| **Forms** | React Hook Form | ^7.61.1 | Form handling and validation |
| **Validation** | Zod | ^3.25.76 | Schema validation |
| **Icons** | Lucide React | ^0.462.0 | Icon library |

## Project Structure

```
frontend/
├── public/                     # Static assets
│   ├── images/                # Image assets
│   │   ├── 5-08.jpg          # Pregnancy illustration
│   │   └── vecteezy_pregnant-woman_8341609.jpg
│   ├── favicon.ico           # App favicon
│   ├── manifest.json         # PWA manifest
│   ├── robots.txt           # SEO robots file
│   └── sitemap.xml          # SEO sitemap
├── src/
│   ├── assets/              # Application assets
│   │   ├── ai-chat-icon.png # AI chat interface icon
│   │   ├── health.png       # Health tracking icon
│   │   ├── hero-maternal.jpg # Hero section image
│   │   ├── pregnancy-tracker.png # Pregnancy tracking icon
│   │   ├── pregnant-woman.gif # Animated illustration
│   │   └── pregnant-woman.png # Static illustration
│   ├── components/          # Reusable UI components
│   │   ├── ai/             # AI-related components
│   │   ├── auth/           # Authentication components
│   │   ├── chat/           # Chat interface components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── emergency/      # Emergency service components
│   │   ├── layout/         # Layout components
│   │   ├── map/            # Map and location components
│   │   ├── reminders/      # Reminder components
│   │   ├── resources/      # Educational resource components
│   │   └── ui/             # shadcn/ui base components
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx  # Mobile detection hook
│   │   └── use-toast.ts    # Toast notification hook
│   ├── lib/                # Utility libraries
│   │   ├── aiService.ts    # AI service integration
│   │   ├── api.ts          # API client configuration
│   │   ├── homepageService.ts # Homepage data service
│   │   └── utils.ts        # Utility functions
│   ├── pages/              # Page components
│   │   └── NotFound.tsx    # 404 error page
│   ├── App.tsx             # Main application component
│   ├── index.css           # Global styles
│   ├── main.tsx            # Application entry point
│   └── vite-env.d.ts       # Vite type definitions
├── .env                    # Environment variables
├── .env.example           # Environment template
├── components.json        # shadcn/ui configuration
├── Dockerfile             # Container configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Component Architecture

### AI Components (`src/components/ai/`)

#### AIPregnancyGuide.tsx
```typescript
interface AIPregnancyGuideProps {
  currentWeek: number;
  dueDate: Date;
  onWeekSelect: (week: number) => void;
}

export function AIPregnancyGuide({ currentWeek, dueDate, onWeekSelect }: AIPregnancyGuideProps) {
  // Provides week-by-week pregnancy guidance with AI insights
  // Features: milestone tracking, symptom explanations, care recommendations
}
```

#### FloatingAIAssistant.tsx
```typescript
interface FloatingAIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  position?: 'bottom-right' | 'bottom-left';
}

export function FloatingAIAssistant({ isOpen, onToggle, position = 'bottom-right' }: FloatingAIAssistantProps) {
  // Floating AI chat button with quick access to assistance
  // Features: minimizable chat, quick responses, emergency escalation
}
```

#### VirtualAIAssistant.tsx
```typescript
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'voice' | 'image';
}

export function VirtualAIAssistant() {
  // Main AI chat interface with comprehensive health guidance
  // Features: text/voice input, multilingual support, context awareness
}
```

### Authentication Components (`src/components/auth/`)

#### LoginForm.tsx
```typescript
interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export function LoginForm() {
  // User login with email/password authentication
  // Features: form validation, error handling, remember me option
}
```

#### RegisterForm.tsx
```typescript
interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  dateOfBirth: Date;
  pregnancyInfo?: {
    isPregnant: boolean;
    dueDate?: Date;
    lastMenstrualPeriod?: Date;
  };
}

export function RegisterForm() {
  // User registration with pregnancy information collection
  // Features: multi-step form, validation, pregnancy status setup
}
```

### Dashboard Components (`src/components/dashboard/`)

#### Dashboard.tsx
```typescript
interface DashboardProps {
  user: User;
  pregnancyData: PregnancyData;
  upcomingAppointments: Appointment[];
}

export function Dashboard({ user, pregnancyData, upcomingAppointments }: DashboardProps) {
  // Main dashboard with health overview and quick actions
  // Features: pregnancy progress, health metrics, quick access buttons
}
```

#### PregnancyProgress.tsx
```typescript
interface PregnancyProgressProps {
  currentWeek: number;
  dueDate: Date;
  milestones: Milestone[];
  symptoms: SymptomLog[];
}

export function PregnancyProgress({ currentWeek, dueDate, milestones, symptoms }: PregnancyProgressProps) {
  // Visual pregnancy progress tracker with milestones
  // Features: week-by-week progress, milestone celebrations, symptom tracking
}
```

#### EmergencyButton.tsx
```typescript
interface EmergencyButtonProps {
  onEmergencyAlert: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function EmergencyButton({ onEmergencyAlert, isLoading, disabled }: EmergencyButtonProps) {
  // Large, prominent emergency alert button
  // Features: one-tap emergency, GPS location sharing, contact notification
}
```

### Chat Components (`src/components/chat/`)

#### AIChatInterface.tsx
```typescript
interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type: 'text' | 'voice';
  metadata?: {
    intent?: string;
    confidence?: number;
    suggestions?: string[];
  };
}

export function AIChatInterface() {
  // Full-featured AI chat interface
  // Features: real-time messaging, voice input, typing indicators, message history
}
```

#### TextChat.tsx
```typescript
interface TextChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function TextChat({ messages, onSendMessage, isLoading }: TextChatProps) {
  // Text-based chat component with message history
  // Features: message bubbles, timestamps, delivery status, auto-scroll
}
```

## State Management

### React Query Configuration
```typescript
// lib/api.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error.status === 404 || error.status === 401) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### Custom Hooks for Data Fetching
```typescript
// hooks/usePregnancyData.ts
export function usePregnancyData() {
  return useQuery({
    queryKey: ['pregnancy-data'],
    queryFn: async () => {
      const response = await api.get('/pregnancy/progress');
      return response.data;
    },
    enabled: !!user?.pregnancyInfo?.isPregnant,
  });
}

// hooks/useChatHistory.ts
export function useChatHistory() {
  return useQuery({
    queryKey: ['chat-history'],
    queryFn: async () => {
      const response = await api.get('/chat/history');
      return response.data;
    },
  });
}

// hooks/useEmergencyContacts.ts
export function useEmergencyContacts() {
  return useQuery({
    queryKey: ['emergency-contacts'],
    queryFn: async () => {
      const response = await api.get('/emergency/contacts');
      return response.data;
    },
  });
}
```

## Styling & Design System

### Tailwind CSS Configuration
```typescript
// tailwind.config.ts
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7f0',
          100: '#fdeee0',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

### Component Styling Patterns
```typescript
// Consistent styling patterns using class-variance-authority
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-3 rounded-md',
        lg: 'h-11 px-8 rounded-md',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

## Form Handling & Validation

### React Hook Form with Zod Validation
```typescript
// Example: Registration form with validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  phoneNumber: z.string().regex(/^\+233\d{9}$/, 'Please enter a valid Ghana phone number'),
  dateOfBirth: z.date().max(new Date(), 'Date of birth cannot be in the future'),
  pregnancyInfo: z.object({
    isPregnant: z.boolean(),
    dueDate: z.date().optional(),
    lastMenstrualPeriod: z.date().optional(),
  }).optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      await api.post('/auth/register', data);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Form fields */}
    </form>
  );
}
```

## API Integration

### API Client Configuration
```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/auth/refresh-token', {
          refreshToken,
        });
        
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### Service Layer Examples
```typescript
// lib/aiService.ts
export class AIService {
  static async sendMessage(message: string, context?: any) {
    const response = await api.post('/chat/message', {
      message,
      context,
    });
    return response.data;
  }

  static async getVoiceResponse(audioBlob: Blob) {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await api.post('/chat/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

// lib/emergencyService.ts
export class EmergencyService {
  static async sendAlert(alertData: {
    type: string;
    message: string;
    location: { latitude: number; longitude: number };
  }) {
    const response = await api.post('/emergency/alert', alertData);
    return response.data;
  }

  static async getEmergencyContacts() {
    const response = await api.get('/emergency/contacts');
    return response.data;
  }
}
```

## Responsive Design & Mobile Optimization

### Mobile-First Approach
```typescript
// hooks/use-mobile.tsx
import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
}
```

### Responsive Component Example
```typescript
// components/layout/BottomNavigation.tsx
export function BottomNavigation() {
  const isMobile = useMobile();
  const location = useLocation();

  if (!isMobile) return null;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/chat', icon: MessageCircle, label: 'AI Chat' },
    { path: '/clinics', icon: MapPin, label: 'Clinics' },
    { path: '/reminders', icon: Bell, label: 'Reminders' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center py-2 px-3 rounded-lg transition-colors',
              location.pathname === item.path
                ? 'text-primary bg-primary/10'
                : 'text-gray-600 hover:text-primary'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

## Performance Optimization

### Code Splitting & Lazy Loading
```typescript
// App.tsx - Route-based code splitting
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AIChat = lazy(() => import('./pages/AIChat'));
const ClinicLocator = lazy(() => import('./pages/ClinicLocator'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/clinics" element={<ClinicLocator />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
```

### Image Optimization
```typescript
// components/ui/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function OptimizedImage({ 
  src, 
  alt, 
  className, 
  loading = 'lazy' 
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={(e) => {
        e.currentTarget.src = '/images/placeholder.svg';
      }}
    />
  );
}
```

## Accessibility Features

### ARIA Labels and Screen Reader Support
```typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'default', 
  size = 'default', 
  loading, 
  children, 
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }))}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" 
              aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
```

### Keyboard Navigation
```typescript
// components/chat/AIChatInterface.tsx
export function AIChatInterface() {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.isUser ? 'justify-end' : 'justify-start'
            )}
            role="log"
            aria-live="polite"
          >
            {/* Message content */}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 resize-none border rounded-lg p-3"
            rows={1}
            aria-label="Chat message input"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## Environment Configuration

### Environment Variables
```bash
# .env.example
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api

# Google Maps Integration
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# App Configuration
VITE_APP_NAME=MAMA Health Ghana
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_VOICE_CHAT=true
VITE_ENABLE_VIDEO_CALLS=false
VITE_ENABLE_OFFLINE_MODE=true

# Analytics (optional)
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

### Build Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          utils: ['date-fns', 'clsx', 'tailwind-merge'],
        },
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

## Testing Strategy

### Component Testing with React Testing Library
```typescript
// __tests__/components/EmergencyButton.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmergencyButton } from '@/components/dashboard/EmergencyButton';

describe('EmergencyButton', () => {
  it('should call onEmergencyAlert when clicked', async () => {
    const mockOnEmergencyAlert = jest.fn();
    
    render(
      <EmergencyButton onEmergencyAlert={mockOnEmergencyAlert} />
    );
    
    const button = screen.getByRole('button', { name: /emergency/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockOnEmergencyAlert).toHaveBeenCalledTimes(1);
    });
  });

  it('should be disabled when loading', () => {
    const mockOnEmergencyAlert = jest.fn();
    
    render(
      <EmergencyButton 
        onEmergencyAlert={mockOnEmergencyAlert} 
        isLoading={true} 
      />
    );
    
    const button = screen.getByRole('button', { name: /emergency/i });
    expect(button).toBeDisabled();
  });
});
```

### Integration Testing
```typescript
// __tests__/integration/ChatFlow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AIChatInterface } from '@/components/chat/AIChatInterface';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

describe('AI Chat Integration', () => {
  it('should send message and receive response', async () => {
    const queryClient = createTestQueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <AIChatInterface />
      </QueryClientProvider>
    );
    
    const input = screen.getByLabelText(/chat message input/i);
    const sendButton = screen.getByLabelText(/send message/i);
    
    fireEvent.change(input, { target: { value: 'Hello, I need help' } });
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Hello, I need help')).toBeInTheDocument();
    });
    
    // Mock API response would be tested here
  });
});
```

## Deployment & Build Process

### Production Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Build with specific environment
npm run build:dev
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### PWA Configuration
```json
// public/manifest.json
{
  "name": "MAMA Health Ghana",
  "short_name": "MAMA",
  "description": "AI-powered maternal health companion for expectant mothers in Ghana",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f97316",
  "icons": [
    {
      "src": "/favicon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/favicon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

This comprehensive frontend documentation covers all aspects of the MAMA platform's client-side implementation, from component architecture to deployment strategies.
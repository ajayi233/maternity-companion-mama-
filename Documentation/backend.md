# Backend Documentation - MAMA Health Platform

## Architecture Overview

The MAMA backend is built with Node.js and Express.js, providing a robust RESTful API for the maternal health platform. It follows a modular architecture with clear separation of concerns across controllers, services, models, and middleware layers.

## Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Runtime** | Node.js | 18+ | JavaScript runtime environment |
| **Framework** | Express.js | ^4.18.2 | Web application framework |
| **Database** | MongoDB | Latest | NoSQL document database |
| **ODM** | Mongoose | ^8.0.3 | MongoDB object modeling |
| **Authentication** | JWT | ^9.0.2 | JSON Web Token authentication |
| **Security** | Helmet | ^7.1.0 | Security headers middleware |
| **Validation** | Express Validator | ^7.0.1 | Input validation and sanitization |
| **SMS Service** | MNotify API | - | Ghana-specific SMS delivery |

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── controllers/             # Request handlers and business logic
│   │   ├── authController.js    # Authentication endpoints
│   │   ├── chatController.js    # AI chat functionality
│   │   ├── clinicController.js  # Healthcare facility management
│   │   ├── emergencyController.js # Emergency alert system
│   │   ├── healthServiceController.js # Health services
│   │   ├── pregnancyController.js # Pregnancy tracking
│   │   ├── reminderController.js # Appointment reminders
│   │   └── resourceController.js # Educational resources
│   ├── middleware/              # Express middleware functions
│   │   ├── auth.js             # JWT authentication middleware
│   │   ├── errorHandler.js     # Global error handling
│   │   ├── rateLimiter.js      # API rate limiting
│   │   ├── security.js         # Security middleware setup
│   │   └── validation.js       # Input validation rules
│   ├── models/                 # Mongoose schemas and models
│   │   ├── ChatMessage.js      # Chat conversation history
│   │   ├── Clinic.js           # Healthcare facility data
│   │   ├── EducationalContent.js # Health education content
│   │   ├── EmergencyAlert.js   # Emergency alert records
│   │   ├── Notification.js     # System notifications
│   │   ├── PasswordReset.js    # Password reset tokens
│   │   ├── Reminder.js         # Appointment and medication reminders
│   │   ├── SymptomLog.js       # User symptom tracking
│   │   └── User.js             # User profiles and authentication
│   ├── routes/                 # API route definitions
│   │   ├── auth.js             # Authentication routes
│   │   ├── authRoutes.js       # Extended auth routes
│   │   ├── chatRoutes.js       # AI chat routes
│   │   ├── clinicRoutes.js     # Clinic management routes
│   │   ├── emergency.js        # Emergency service routes
│   │   ├── emergencyRoutes.js  # Extended emergency routes
│   │   ├── healthcareRoutes.js # Healthcare service routes
│   │   ├── pregnancyRoutes.js  # Pregnancy tracking routes
│   │   ├── reminderRoutes.js   # Reminder management routes
│   │   └── resourceRoutes.js   # Educational resource routes
│   ├── services/               # Business logic and external integrations
│   │   ├── aiService.js        # AI chat integration
│   │   ├── authService.js      # Authentication business logic
│   │   ├── clinicService.js    # Clinic data management
│   │   ├── cronService.js      # Scheduled tasks and jobs
│   │   ├── emergencyService.js # Emergency alert processing
│   │   ├── HealthcareFacilitiesService.js # Healthcare facility search
│   │   ├── mnotifyService.js   # SMS notification service
│   │   ├── notificationService.js # Push notification handling
│   │   ├── pregnancyService.js # Pregnancy tracking logic
│   │   └── reminderService.js  # Reminder scheduling
│   ├── app.js                  # Express application setup
│   └── server.js               # Server startup and configuration
├── temp/                       # Temporary file storage
├── .env                        # Environment variables
├── .env.example               # Environment template
├── Dockerfile                 # Container configuration
├── package.json               # Dependencies and scripts
└── start.js                   # Application entry point
```

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | User registration | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/profile` | Get user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |
| POST | `/api/auth/change-password` | Change password | Yes |
| POST | `/api/auth/refresh-token` | Refresh JWT token | Yes |

### Healthcare Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/healthcare/facilities` | Get nearby healthcare facilities | Yes |
| GET | `/api/healthcare/facilities/:id` | Get specific facility details | Yes |
| POST | `/api/healthcare/book-appointment` | Book appointment | Yes |
| GET | `/api/healthcare/appointments` | Get user appointments | Yes |
| PUT | `/api/healthcare/appointments/:id` | Update appointment | Yes |
| DELETE | `/api/healthcare/appointments/:id` | Cancel appointment | Yes |

### Emergency Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/emergency/alert` | Send emergency alert | Yes |
| GET | `/api/emergency/contacts` | Get emergency contacts | Yes |
| POST | `/api/emergency/contacts` | Add emergency contact | Yes |
| PUT | `/api/emergency/contacts/:id` | Update emergency contact | Yes |
| DELETE | `/api/emergency/contacts/:id` | Remove emergency contact | Yes |
| GET | `/api/emergency/history` | Get emergency alert history | Yes |

### Chat Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/chat/message` | Send chat message to AI | Yes |
| GET | `/api/chat/history` | Get chat conversation history | Yes |
| DELETE | `/api/chat/history` | Clear chat history | Yes |
| POST | `/api/chat/voice` | Process voice message | Yes |

### Pregnancy Tracking Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/pregnancy/track` | Update pregnancy progress | Yes |
| GET | `/api/pregnancy/progress` | Get pregnancy timeline | Yes |
| POST | `/api/pregnancy/symptoms` | Log pregnancy symptoms | Yes |
| GET | `/api/pregnancy/symptoms` | Get symptom history | Yes |
| GET | `/api/pregnancy/milestones` | Get pregnancy milestones | Yes |

### Reminder Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/reminders` | Create new reminder | Yes |
| GET | `/api/reminders` | Get user reminders | Yes |
| PUT | `/api/reminders/:id` | Update reminder | Yes |
| DELETE | `/api/reminders/:id` | Delete reminder | Yes |
| POST | `/api/reminders/:id/snooze` | Snooze reminder | Yes |

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  firstName: String (required),
  lastName: String (required),
  phoneNumber: String,
  dateOfBirth: Date,
  pregnancyInfo: {
    isPregnant: Boolean,
    dueDate: Date,
    currentWeek: Number,
    lastMenstrualPeriod: Date
  },
  emergencyContacts: [{
    name: String,
    phoneNumber: String,
    relationship: String
  }],
  preferences: {
    language: String (default: 'en'),
    notifications: {
      sms: Boolean (default: true),
      push: Boolean (default: true),
      email: Boolean (default: false)
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### ChatMessage Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  message: String (required),
  response: String,
  messageType: String (enum: ['text', 'voice']),
  isFromUser: Boolean (required),
  metadata: {
    sentiment: String,
    intent: String,
    confidence: Number
  },
  createdAt: Date
}
```

### Clinic Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  address: String (required),
  location: {
    type: String (default: 'Point'),
    coordinates: [Number] // [longitude, latitude]
  },
  phoneNumber: String,
  email: String,
  services: [String],
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    // ... other days
  },
  rating: Number,
  verified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### EmergencyAlert Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User'),
  alertType: String (enum: ['medical', 'emergency', 'urgent']),
  message: String,
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  status: String (enum: ['active', 'resolved', 'cancelled']),
  contactsNotified: [String], // phone numbers
  responseTime: Number, // in seconds
  resolvedAt: Date,
  createdAt: Date
}
```

## Security Implementation

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication with access and refresh tokens
- **Password Hashing**: bcrypt with 12 salt rounds
- **Token Expiration**: 15-minute access tokens, 7-day refresh tokens
- **Role-Based Access**: User roles and permissions system

### Security Middleware
```javascript
// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
```

### Input Validation & Sanitization
```javascript
// Example validation middleware
export const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('firstName').trim().isLength({ min: 2, max: 50 }),
  body('lastName').trim().isLength({ min: 2, max: 50 }),
  body('phoneNumber').isMobilePhone('any')
];
```

## External Service Integrations

### MNotify SMS Service
```javascript
class MNotifyService {
  constructor() {
    this.apiKey = process.env.MNOTIFY_API_KEY;
    this.senderId = process.env.MNOTIFY_SENDER_ID;
    this.baseUrl = 'https://api.mnotify.com/api/sms/quick';
  }

  async sendSMS(recipient, message) {
    try {
      const response = await axios.post(this.baseUrl, {
        recipient: [recipient],
        sender: this.senderId,
        message: message,
        is_schedule: false,
        schedule_date: ''
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(`SMS sending failed: ${error.message}`);
    }
  }
}
```

### AI Service Integration
```javascript
class AIService {
  async processMessage(message, userId, context = {}) {
    try {
      // Process user message with AI service
      const response = await this.callAIAPI({
        message,
        userId,
        context: {
          pregnancyWeek: context.pregnancyWeek,
          symptoms: context.recentSymptoms,
          language: context.preferredLanguage
        }
      });

      // Save conversation to database
      await this.saveChatMessage(userId, message, response.text);
      
      return {
        response: response.text,
        intent: response.intent,
        confidence: response.confidence,
        suggestions: response.suggestions
      };
    } catch (error) {
      throw new Error(`AI processing failed: ${error.message}`);
    }
  }
}
```

## Error Handling

### Global Error Handler
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

### Custom Error Classes
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}
```

## Environment Configuration

### Required Environment Variables
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/mama-app
MONGODB_TEST_URI=mongodb://localhost:27017/mama-app-test

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# SMS Service (MNotify)
MNOTIFY_API_KEY=your-mnotify-api-key
MNOTIFY_SENDER_ID=MAMA-APP

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Server Configuration
PORT=5000
NODE_ENV=development

# AI Service
AI_SERVICE_URL=https://api.openai.com/v1
AI_SERVICE_KEY=your-ai-service-key

# Google Maps (for clinic search)
GOOGLE_MAPS_API_KEY=your-google-maps-key
```

## Scheduled Tasks (Cron Jobs)

### Reminder Service
```javascript
// Send appointment reminders
cron.schedule('0 9 * * *', async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const reminders = await Reminder.find({
      scheduledDate: {
        $gte: new Date(tomorrow.setHours(0, 0, 0, 0)),
        $lt: new Date(tomorrow.setHours(23, 59, 59, 999))
      },
      status: 'active'
    }).populate('userId');
    
    for (const reminder of reminders) {
      await notificationService.sendReminder(reminder);
    }
  } catch (error) {
    console.error('Reminder cron job failed:', error);
  }
});
```

## Testing Strategy

### Unit Tests
```javascript
// Example test for auth controller
describe('AuthController', () => {
  describe('register', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'Test',
        lastName: 'User'
      };
      
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);
        
      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(userData.email);
    });
  });
});
```

### Integration Tests
```javascript
// Example integration test
describe('Emergency Alert Integration', () => {
  it('should send SMS when emergency alert is created', async () => {
    const alertData = {
      alertType: 'medical',
      message: 'Need immediate help',
      location: { latitude: 5.6037, longitude: -0.1870 }
    };
    
    const response = await request(app)
      .post('/api/emergency/alert')
      .set('Authorization', `Bearer ${userToken}`)
      .send(alertData)
      .expect(201);
      
    // Verify SMS was sent
    expect(mockSMSService.sendSMS).toHaveBeenCalled();
  });
});
```

## Performance Optimization

### Database Indexing
```javascript
// User model indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ 'pregnancyInfo.dueDate': 1 });

// Clinic model indexes
clinicSchema.index({ location: '2dsphere' }); // Geospatial index
clinicSchema.index({ services: 1 });
clinicSchema.index({ verified: 1 });

// ChatMessage model indexes
chatMessageSchema.index({ userId: 1, createdAt: -1 });
```

### Caching Strategy
```javascript
// Redis caching for frequently accessed data
const redis = require('redis');
const client = redis.createClient();

// Cache clinic data
async function getClinicsNearby(lat, lng, radius) {
  const cacheKey = `clinics:${lat}:${lng}:${radius}`;
  
  // Try cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Query database
  const clinics = await Clinic.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: radius
      }
    }
  });
  
  // Cache for 1 hour
  await client.setex(cacheKey, 3600, JSON.stringify(clinics));
  return clinics;
}
```

## Deployment & Monitoring

### Health Check Endpoint
```javascript
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    res.json({
      success: true,
      message: 'MAMA Backend API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Service unavailable',
      error: error.message
    });
  }
});
```

### Logging Configuration
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

## API Documentation

The backend API is documented using OpenAPI/Swagger specification. Access the interactive documentation at `/api-docs` when running in development mode.

### Example API Response Format
```javascript
// Success Response
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Detailed error information"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

This backend documentation provides comprehensive coverage of the MAMA platform's server-side architecture, implementation details, and operational procedures.
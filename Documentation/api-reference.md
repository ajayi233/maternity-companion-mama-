# API Reference - MAMA Health Platform

## Base URL
```
Production: https://api.auto-hive.site
Development: http://localhost:5000
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "password": "SecurePass123",
  "phoneNumber": "+233123456789",
  "dateOfBirth": "1990-05-15",
  "pregnancyInfo": {
    "isPregnant": true,
    "dueDate": "2024-08-15",
    "lastMenstrualPeriod": "2023-11-15"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "jane@example.com",
      "firstName": "Jane",
      "lastName": "Doe"
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### POST /api/auth/login
Authenticate user and receive access tokens.

**Request Body:**
```json
{
  "email": "jane@example.com",
  "password": "SecurePass123"
}
```

### GET /api/auth/profile
Get current user profile information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "jane@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "pregnancyInfo": {
        "isPregnant": true,
        "currentWeek": 24,
        "dueDate": "2024-08-15"
      }
    }
  }
}
```

## Healthcare Endpoints

### GET /api/healthcare/facilities
Get nearby healthcare facilities.

**Query Parameters:**
- `latitude` (required): User's latitude
- `longitude` (required): User's longitude
- `radius` (optional): Search radius in kilometers (default: 10)
- `services` (optional): Comma-separated list of required services

**Example:**
```
GET /api/healthcare/facilities?latitude=5.6037&longitude=-0.1870&radius=5&services=maternity,emergency
```

**Response:**
```json
{
  "success": true,
  "data": {
    "facilities": [
      {
        "id": "facility_id",
        "name": "Korle Bu Teaching Hospital",
        "address": "Korle Bu, Accra, Ghana",
        "location": {
          "latitude": 5.6037,
          "longitude": -0.1870
        },
        "distance": 2.5,
        "services": ["maternity", "emergency", "pediatrics"],
        "phoneNumber": "+233302665401",
        "rating": 4.2,
        "operatingHours": {
          "monday": { "open": "06:00", "close": "18:00" },
          "tuesday": { "open": "06:00", "close": "18:00" }
        }
      }
    ]
  }
}
```

## Emergency Endpoints

### POST /api/emergency/alert
Send emergency alert to contacts and services.

**Request Body:**
```json
{
  "alertType": "medical",
  "message": "Experiencing severe pregnancy complications",
  "location": {
    "latitude": 5.6037,
    "longitude": -0.1870,
    "address": "123 Main Street, Accra"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Emergency alert sent successfully",
  "data": {
    "alertId": "alert_id",
    "contactsNotified": ["+233123456789", "+233987654321"],
    "estimatedResponseTime": "15 minutes"
  }
}
```

### GET /api/emergency/contacts
Get user's emergency contacts.

**Response:**
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": "contact_id",
        "name": "John Doe",
        "phoneNumber": "+233123456789",
        "relationship": "spouse",
        "isPrimary": true
      }
    ]
  }
}
```

## Chat Endpoints

### POST /api/chat/message
Send message to AI assistant.

**Request Body:**
```json
{
  "message": "I'm experiencing morning sickness. What should I do?",
  "context": {
    "pregnancyWeek": 8,
    "symptoms": ["nausea", "fatigue"],
    "language": "en"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Morning sickness is common in early pregnancy...",
    "intent": "symptom_inquiry",
    "confidence": 0.95,
    "suggestions": [
      "Try eating small, frequent meals",
      "Stay hydrated",
      "Consider ginger tea"
    ],
    "urgencyLevel": "low",
    "recommendedAction": "monitor_symptoms"
  }
}
```

### GET /api/chat/history
Get chat conversation history.

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 50)
- `offset` (optional): Number of messages to skip (default: 0)

## Pregnancy Tracking Endpoints

### POST /api/pregnancy/track
Update pregnancy progress and milestones.

**Request Body:**
```json
{
  "currentWeek": 24,
  "weight": 65.5,
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "symptoms": ["back_pain", "swollen_feet"],
  "notes": "Feeling good overall, baby is very active"
}
```

### GET /api/pregnancy/progress
Get pregnancy timeline and milestones.

**Response:**
```json
{
  "success": true,
  "data": {
    "currentWeek": 24,
    "dueDate": "2024-08-15",
    "trimester": 2,
    "milestones": [
      {
        "week": 24,
        "title": "Baby's hearing develops",
        "description": "Your baby can now hear sounds from outside the womb",
        "completed": true,
        "date": "2024-03-15"
      }
    ],
    "upcomingAppointments": [
      {
        "id": "appointment_id",
        "type": "routine_checkup",
        "date": "2024-04-01T10:00:00Z",
        "provider": "Dr. Smith"
      }
    ]
  }
}
```

## Reminder Endpoints

### POST /api/reminders
Create a new reminder.

**Request Body:**
```json
{
  "type": "appointment",
  "title": "Prenatal Checkup",
  "description": "Monthly prenatal appointment with Dr. Smith",
  "scheduledDate": "2024-04-01T10:00:00Z",
  "reminderTime": "2024-04-01T09:00:00Z",
  "recurring": {
    "enabled": true,
    "frequency": "monthly",
    "endDate": "2024-08-15"
  }
}
```

### GET /api/reminders
Get user's reminders.

**Query Parameters:**
- `type` (optional): Filter by reminder type
- `status` (optional): Filter by status (active, completed, snoozed)
- `startDate` (optional): Filter reminders from this date
- `endDate` (optional): Filter reminders until this date

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required",
  "error": {
    "code": "UNAUTHORIZED",
    "details": "Access token is missing or invalid"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied",
  "error": {
    "code": "FORBIDDEN",
    "details": "Insufficient permissions for this resource"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found",
  "error": {
    "code": "NOT_FOUND",
    "details": "The requested resource does not exist"
  }
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "details": "Too many requests. Please try again later.",
    "retryAfter": 60
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": {
    "code": "INTERNAL_ERROR",
    "details": "An unexpected error occurred"
  }
}
```

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Emergency endpoints**: 10 requests per hour per user
- **Chat endpoints**: 50 requests per hour per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

### Emergency Alert Webhook
When an emergency alert is triggered, the system can send webhooks to registered endpoints.

**Webhook Payload:**
```json
{
  "event": "emergency.alert.created",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "alertId": "alert_id",
    "userId": "user_id",
    "alertType": "medical",
    "location": {
      "latitude": 5.6037,
      "longitude": -0.1870
    },
    "message": "Emergency alert message",
    "contactsNotified": ["+233123456789"]
  }
}
```

## SDK Examples

### JavaScript/Node.js
```javascript
const MAMA_API = {
  baseURL: 'https://api.auto-hive.site',
  
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  },
  
  // Authentication
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  // Emergency alert
  async sendEmergencyAlert(alertData) {
    return this.request('/api/emergency/alert', {
      method: 'POST',
      body: JSON.stringify(alertData)
    });
  },
  
  // Chat with AI
  async sendChatMessage(message, context) {
    return this.request('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, context })
    });
  }
};
```

### Python
```python
import requests
import json

class MAMAClient:
    def __init__(self, base_url="https://api.auto-hive.site"):
        self.base_url = base_url
        self.access_token = None
    
    def set_token(self, token):
        self.access_token = token
    
    def request(self, endpoint, method="GET", data=None):
        headers = {"Content-Type": "application/json"}
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        
        response = requests.request(
            method=method,
            url=f"{self.base_url}{endpoint}",
            headers=headers,
            json=data
        )
        
        response.raise_for_status()
        return response.json()
    
    def login(self, email, password):
        return self.request("/api/auth/login", "POST", {
            "email": email,
            "password": password
        })
    
    def get_nearby_facilities(self, latitude, longitude, radius=10):
        return self.request(
            f"/api/healthcare/facilities?latitude={latitude}&longitude={longitude}&radius={radius}"
        )
```

## Testing

### Health Check
```bash
curl -X GET https://api.auto-hive.site/health
```

### Authentication Test
```bash
# Login
curl -X POST https://api.auto-hive.site/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use token
curl -X GET https://api.auto-hive.site/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

This API reference provides comprehensive documentation for all endpoints available in the MAMA platform, including request/response formats, authentication, error handling, and usage examples.
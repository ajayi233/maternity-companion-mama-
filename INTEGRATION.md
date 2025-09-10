# MAMA Frontend-Backend Integration Guide

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Backend runs on: `http://localhost:5000`

### 2. Frontend Setup  
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 3. Database
MongoDB will auto-create the `mama-health` database on first connection.

## Authentication Flow

### Registration
1. User fills registration form
2. Frontend sends POST to `/api/auth/register`
3. Backend creates user and returns JWT tokens
4. Frontend stores tokens and redirects to dashboard

### Login
1. User enters phone/password
2. Frontend sends POST to `/api/auth/login`
3. Backend validates and returns tokens
4. Frontend stores tokens and user data

### Password Reset
1. User enters phone number
2. Frontend sends POST to `/api/auth/forgot-password`
3. Backend generates 6-digit code (logged to console in dev)
4. User enters code and new password
5. Frontend sends PUT to `/api/auth/reset-password`

### Token Management
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Frontend auto-refreshes expired tokens
- Failed refresh redirects to login

## API Integration

### Headers
```javascript
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Error Handling
- 401: Token expired/invalid → Auto refresh or redirect to login
- 400: Validation errors → Show user-friendly messages
- 429: Rate limited → Show retry message
- 500: Server error → Show generic error message

## Testing the Integration

1. Start both backend and frontend
2. Register a new account
3. Login with credentials
4. Test password reset flow
5. Verify token refresh on API calls

## Environment Files

Backend `.env`:
```
MONGODB_URI=mongodb://localhost:27017/mama-health
JWT_SECRET=your_secret_key
PORT=5000
```

Frontend `.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Security Features

- Rate limiting on auth endpoints
- Password strength validation
- Account locking after failed attempts
- Secure token storage
- CORS protection
- Input sanitization
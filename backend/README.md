# MAMA Backend API

Authentication-enabled Express.js backend for the MAMA maternal health application.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment:**
   ```bash
   cp .env.example .env
   # MongoDB will auto-create the database
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Test the API:**
   ```bash
   curl http://localhost:5000/health
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password` - Reset password with code
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile

### Health Check
- `GET /health` - Server health status

## Environment Variables

Required variables in `.env`:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `PORT` - Server port (default: 5000)

## Security Features

- JWT authentication with refresh tokens
- Rate limiting (5 auth attempts per 15 minutes)
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Account locking after failed attempts

## Development

The server runs on `http://localhost:5000` and connects to MongoDB automatically.
Frontend should connect to `http://localhost:5000/api` for API calls.
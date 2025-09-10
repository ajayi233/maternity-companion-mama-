# MAMA Frontend-Backend Integration

## Quick Setup

### 1. Start Backend
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:3001`

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

## Integration Status

✅ **API Service**: Frontend configured to connect to backend
✅ **Authentication**: Login, register, password reset integrated
✅ **Token Management**: JWT tokens with refresh logic
✅ **Error Handling**: Proper error messages and token refresh

## Test the Integration

1. **Health Check**: Visit `http://localhost:3001/health`
2. **API Test**: Visit `http://localhost:3001/api/test`
3. **Register**: Create new account in frontend
4. **Login**: Sign in with credentials
5. **Password Reset**: Test forgot password flow

## API Endpoints Available

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh tokens
- `POST /api/auth/forgot-password` - Password reset request
- `PUT /api/auth/reset-password` - Reset password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Get user profile

## Frontend Configuration

The frontend automatically connects to your backend at `http://localhost:3001/api`.

## Notes

- Backend uses your existing configuration
- No changes made to backend environment files
- Frontend adapted to work with your backend structure
- All authentication flows are fully integrated
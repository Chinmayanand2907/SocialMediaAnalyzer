# Authentication Setup Guide

This guide explains how to set up and use the new authentication system in the YouTube Engagement Analyzer.

## 🚀 Features Added

### Backend Features
- **User Registration & Login** - Secure account creation and authentication
- **JWT Token Authentication** - Stateless authentication with JSON Web Tokens
- **Password Hashing** - Secure password storage using bcryptjs
- **User Profile Management** - Update profile information and change passwords
- **Analysis Tracking** - Associate analyses with user accounts
- **Public/Private Analyses** - Control visibility of your analyses

### Frontend Features
- **Modern UI Components** - Beautiful login/signup forms using Chakra UI
- **Authentication Context** - Global state management for user authentication
- **Protected Routes** - Secure access to user-specific features
- **User Menu** - Easy access to profile settings and logout
- **Welcome Banners** - Personalized user experience
- **Form Validation** - Client-side validation with helpful error messages

## 🛠️ Setup Instructions

### 1. Backend Setup

1. **Install new dependencies** (already done):
   ```bash
   cd server
   npm install bcryptjs jsonwebtoken cookie-parser
   ```

2. **Update environment variables**:
   Copy the updated `server/env.example` to `server/.env` and add:
   ```env
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
   JWT_EXPIRES_IN=7d
   ```

   **Important**: Change the `JWT_SECRET` to a strong, unique secret key (minimum 32 characters).

3. **Database Migration**:
   The existing analyses will remain public by default. New analyses will be associated with users when they're logged in.

### 2. Frontend Setup

No additional setup required! The authentication system is integrated into the existing app.

### 3. Start the Application

1. **Start the backend**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend**:
   ```bash
   cd client
   npm run dev
   ```

## 🎯 How to Use

### For Users

1. **Sign Up**: Click "Get Started" or "Sign Up Free" to create an account
2. **Sign In**: Use the "Sign In" button in the header
3. **Analyze Channels**: Your analyses will be automatically saved to your account
4. **View Profile**: Click on your avatar in the header to access profile settings
5. **Change Password**: Use the Security tab in your profile settings

### For Developers

#### Authentication Context
```jsx
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  if (isAuthenticated) {
    return <div>Welcome, {user.firstName}!</div>;
  }
  
  return <button onClick={() => login(credentials)}>Login</button>;
}
```

#### API Calls with Authentication
```javascript
// The authAPI service automatically handles JWT tokens
import { getMe, updateProfile } from './services/authAPI';

// Get current user
const userData = await getMe();

// Update profile
const result = await updateProfile({ firstName: 'John', lastName: 'Doe' });
```

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs with salt rounds of 12
- **JWT Tokens**: Secure, stateless authentication with configurable expiration
- **Input Validation**: Both client-side and server-side validation
- **CORS Protection**: Configured for secure cross-origin requests
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 📊 Database Schema

### User Model
```javascript
{
  username: String (unique, 3-30 chars, alphanumeric + underscore)
  email: String (unique, valid email format)
  password: String (hashed, min 6 chars)
  firstName: String (required, max 50 chars)
  lastName: String (required, max 50 chars)
  avatar: String (optional)
  isActive: Boolean (default: true)
  lastLogin: Date
  analysisCount: Number (default: 0)
  createdAt: Date
  updatedAt: Date
}
```

### Updated Analysis Model
```javascript
{
  // ... existing fields ...
  userId: ObjectId (optional, references User)
  isPublic: Boolean (default: true)
}
```

## 🌐 API Endpoints

### Authentication Routes (`/api/auth/`)
- `POST /register` - Create new user account
- `POST /login` - User login
- `POST /logout` - User logout (protected)
- `GET /me` - Get current user info (protected)
- `PUT /profile` - Update user profile (protected)
- `PUT /change-password` - Change password (protected)

### Updated YouTube Routes (`/api/`)
- `POST /analyze/channel` - Analyze channel (optional auth)
- `GET /history` - Get analysis history (optional auth)

## 🎨 UI Components

### New Components
- `AuthModal` - Combined login/signup modal
- `LoginForm` - User login form
- `RegisterForm` - User registration form
- `UserMenu` - User dropdown menu
- `ProfileModal` - User profile settings
- `Header` - Navigation header with auth buttons
- `WelcomeBanner` - Contextual welcome messages

## 🔄 Migration Notes

- **Existing Data**: All existing analyses remain accessible and are marked as public
- **Backward Compatibility**: The app works for both authenticated and anonymous users
- **Gradual Adoption**: Users can use the app without signing up, but get benefits when they do

## 🚨 Production Considerations

1. **JWT Secret**: Use a strong, unique JWT secret in production
2. **HTTPS**: Always use HTTPS in production for secure token transmission
3. **Rate Limiting**: Consider adding rate limiting to authentication endpoints
4. **Email Verification**: Consider adding email verification for new accounts
5. **Password Reset**: Consider adding password reset functionality
6. **Session Management**: Consider implementing refresh tokens for longer sessions

## 🐛 Troubleshooting

### Common Issues

1. **"Token expired" errors**: The JWT token has expired (default: 7 days). User needs to log in again.
2. **CORS errors**: Check that `CLIENT_URL` in server `.env` matches your frontend URL.
3. **Database connection**: Ensure MongoDB is running and connection string is correct.
4. **Missing JWT secret**: Make sure `JWT_SECRET` is set in server `.env` file.

### Debug Mode
Set `NODE_ENV=development` in your server `.env` for detailed error messages.

## 📈 Future Enhancements

- Email verification for new accounts
- Password reset functionality
- Social login (Google, GitHub)
- User roles and permissions
- Analysis sharing and collaboration
- API rate limiting per user
- Advanced user analytics dashboard

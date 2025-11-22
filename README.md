# YouTube Engagement Analyzer

A full-stack MERN application that provides comprehensive analytics for YouTube channels. Features user authentication, channel analysis, data visualization, and historical tracking of engagement metrics.

## ✨ Features

### 🔐 Authentication System
- User registration and login with JWT tokens
- Secure password hashing with bcryptjs
- Protected routes and optional authentication
- Profile management with password change functionality
- Persistent sessions with automatic token validation

### 📊 YouTube Analytics
- **Channel Analysis**: Analyze any public YouTube channel by Channel ID
- **Engagement Metrics**: Calculate engagement rates for channels and individual videos
- **Video Statistics**: Fetch and display views, likes, comments, and publish dates
- **Subscriber Tracking**: Display current subscriber counts and channel metadata
- **Historical Data**: Save and retrieve previous analysis reports

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Chakra UI components
- **Dark Theme**: Consistent dark theme throughout the application
- **Interactive Charts**: Data visualization with Recharts (bar charts, donut charts)
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Loading States**: Full-screen loading overlays with progress indicators
- **Toast Notifications**: Real-time feedback for user actions

### 🚀 Technical Features
- **Real-time Updates**: Live data fetching from YouTube Data API v3
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **API Retry Logic**: Automatic retry for failed network requests
- **Server Health Monitoring**: Frontend checks backend availability
- **Secure API**: Backend-only YouTube API key exposure
- **Data Persistence**: MongoDB storage for users and analysis reports

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and context
- **Vite** - Fast build tool and dev server
- **Chakra UI** - Component library with dark theme support
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Recharts** - Data visualization library
- **Framer Motion** - Animation library
- **React Hook Form** - Form validation and management

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **YouTube Data API v3** - Google's YouTube API
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── theme/          # Theme configuration
│   │   └── App.jsx         # Main application component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend application
│   ├── config/             # Database configuration
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   └── server.js           # Express server setup
├── README.md               # Project documentation
└── .gitignore             # Git ignore rules
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- MongoDB instance (local or MongoDB Atlas)
- YouTube Data API v3 key from Google Cloud Console

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SocialMedia
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server && npm install
   
   # Install frontend dependencies
   cd ../client && npm install
   ```

3. **Environment Variables**
   
   Create `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   YOUTUBE_API_KEY=your_youtube_data_api_key
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```
   
   Create `client/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   Server runs on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd client
   npm run dev
   ```
   Client runs on `http://localhost:5173`

3. **Access the application**
   Open `http://localhost:5173` in your browser

## 🔧 API Endpoints

### Authentication Routes (`/api/auth/`)
- `POST /register` - Create new user account
- `POST /login` - User login with credentials
- `POST /logout` - User logout (protected)
- `GET /me` - Get current user information (protected)
- `PUT /profile` - Update user profile (protected)
- `PUT /change-password` - Change user password (protected)

### YouTube Analytics Routes (`/api/`)
- `POST /analyze/channel` - Analyze YouTube channel (optional auth)
  - Body: `{ "channelId": "UCxxxxxxxx" }`
  - Returns: Channel metadata, engagement metrics, video statistics
- `GET /history` - Get analysis history (optional auth)
  - Returns: Up to 20 recent analysis reports

## 🎯 Usage

### For Guest Users
1. Visit the dashboard at `http://localhost:5173/dashboard`
2. Enter a YouTube Channel ID (without the "UC" prefix)
3. Click "Analyze Channel" to get instant engagement metrics
4. View public analysis history

### For Registered Users
1. Sign up for a free account or log in
2. Analyze channels with automatic saving to your account
3. Access your personal analysis history
4. Manage your profile and account settings

### Getting YouTube Channel IDs
- Visit any YouTube channel
- Look at the URL: `youtube.com/channel/UCxxxxxxxxx`
- Copy the part after "UC" (e.g., if the ID is "UCBJycsmduvYEL83R_U4JriQ", enter "BJycsmduvYEL83R_U4JriQ")

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **API Key Protection**: YouTube API key only accessible from backend
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Secure error messages without sensitive data exposure

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Deploy to platforms like Render, Railway, or Heroku
3. Configure environment variables in your hosting platform
4. Update `CLIENT_URL` to your frontend domain

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to Vercel, Netlify, or similar platforms
3. Update `VITE_API_BASE_URL` to your backend domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- YouTube Data API v3 for providing channel and video data
- Chakra UI for the beautiful component library
- The React and Node.js communities for excellent documentation and support

---

**Built with ❤️ using the MERN stack**
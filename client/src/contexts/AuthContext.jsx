import { createContext, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '@chakra-ui/react';
import * as authAPI from '../services/authAPI';

// Auth context
const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false, // Start with loading false to prevent blocking navigation
  error: null
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const toast = useToast();

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Only verify token if it exists
          dispatch({ type: 'LOGIN_START' });
          const userData = await authAPI.getMe();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: userData.data.user,
              token
            }
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          // Token might be expired or invalid
          localStorage.removeItem('token');
          dispatch({ type: 'LOGOUT' });
        }
      }
      // If no token, don't do anything - user remains unauthenticated
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await authAPI.login(credentials);
      const { user, token } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      toast({
        title: 'Welcome back!',
        description: `Hello ${user.firstName}! You're now logged in.`,
        status: 'success',
        duration: 4000,
        isClosable: true
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });

      toast({
        title: 'Login Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const response = await authAPI.register(userData);
      const { user, token } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });

      toast({
        title: 'Account Created!',
        description: `Welcome ${user.firstName}! Your account has been created successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: errorMessage
      });

      toast({
        title: 'Registration Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state and storage
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully.',
        status: 'info',
        duration: 3000,
        isClosable: true
      });
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      const { user } = response.data;

      dispatch({
        type: 'UPDATE_USER',
        payload: user
      });

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
        status: 'success',
        duration: 4000,
        isClosable: true
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      
      toast({
        title: 'Update Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      return { success: false, error: errorMessage };
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      await authAPI.changePassword(passwordData);

      toast({
        title: 'Password Changed',
        description: 'Your password has been changed successfully.',
        status: 'success',
        duration: 4000,
        isClosable: true
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password change failed';
      
      toast({
        title: 'Password Change Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      });

      return { success: false, error: errorMessage };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Refresh user data from backend
  const refreshUserData = async () => {
    try {
      const userData = await authAPI.getMe();
      dispatch({
        type: 'UPDATE_USER',
        payload: userData.data.user
      });
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };


  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

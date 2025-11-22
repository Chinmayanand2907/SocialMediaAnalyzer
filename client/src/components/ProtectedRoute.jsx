import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Spinner, Center, Text, VStack } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate, requireAuth]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Box minH="100vh" bgGradient="linear(to-b, gray.900, gray.950)">
        <Center h="100vh">
          <VStack spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color="white" fontSize="lg">
              Loading...
            </Text>
          </VStack>
        </Center>
      </Box>
    );
  }

  // If auth is required but user is not authenticated, don't render children
  // (navigation will happen in useEffect)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAuth: PropTypes.bool
};

export default ProtectedRoute;

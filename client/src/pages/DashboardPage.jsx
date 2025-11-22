import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Text,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  Avatar,
  Badge,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AnalyzeForm from '../components/AnalyzeForm';
import KpiCards from '../components/KpiCards';
import VideoCharts from '../components/VideoCharts';
import VideoTable from '../components/VideoTable';
import HistoryPanel from '../components/HistoryPanel';
import LoadingOverlay from '../components/LoadingOverlay';
import ProfileModal from '../components/ProfileModal';
import { analyzeChannel, fetchHistory, checkServerHealth } from '../services/api';
import { colors, animations } from '../theme/colors';

const MotionBox = motion(Box);

const DashboardHeader = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg="gray.900" borderBottom="1px" borderColor="gray.700" position="sticky" top={0} zIndex={10}>
        <Container maxW="6xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <Heading size="lg" color="white">
              YouTube Analyzer
            </Heading>

            <HStack spacing={4}>
              {isAuthenticated ? (
                <HStack spacing={3}>
                  <VStack spacing={0} align="end" display={{ base: 'none', md: 'flex' }}>
                    <Text fontSize="sm" fontWeight="medium" color="white">
                      {user?.firstName} {user?.lastName}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      @{user?.username}
                    </Text>
                  </VStack>
                  <Avatar
                    size="sm"
                    name={user?.fullName}
                    src={user?.avatar}
                    bg="blue.500"
                    cursor="pointer"
                    onClick={onOpen}
                  />
                  <Button
                    variant="ghost"
                    color="white"
                    size="sm"
                    onClick={logout}
                    _hover={{ bg: 'whiteAlpha.200' }}
                  >
                    Sign Out
                  </Button>
                </HStack>
              ) : (
                <HStack spacing={3}>
                  <Button
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    bgGradient={colors.buttons.primary}
                    color="white"
                    _hover={{ bgGradient: colors.buttons.primaryHover }}
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </HStack>
              )}
            </HStack>
          </Flex>
        </Container>
      </Box>
      <ProfileModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

const WelcomeBanner = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <MotionBox
        {...animations.fadeInUp}
        transition={{ duration: 0.5 }}
      >
        <Alert
          status="success"
          variant="subtle"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          borderRadius="xl"
          bg="green.50"
          borderColor="green.200"
          border="2px"
          py={4}
        >
          <HStack>
            <AlertIcon />
            <Box>
              <Text fontWeight="bold" color="green.800">
                Welcome back, {user?.firstName}! 🎉
              </Text>
              <Text color="green.700" fontSize="sm">
Your channel analyses are automatically saved to your account for easy access anytime.
              </Text>
            </Box>
          </HStack>
        </Alert>
      </MotionBox>
    );
  }

  return (
    <MotionBox
      {...animations.fadeInUp}
      transition={{ duration: 0.5 }}
    >
      <Alert
        status="info"
        variant="subtle"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        borderRadius="xl"
        bg="blue.50"
        borderColor="blue.200"
        border="2px"
        py={4}
      >
        <HStack>
          <AlertIcon />
          <Box>
            <Text fontWeight="bold" color="blue.800">
Sign up to save your channel analyses! 📊
            </Text>
            <Text color="blue.700" fontSize="sm">
Create a free account to save your YouTube channel analyses and access them anytime.
            </Text>
          </Box>
        </HStack>
        <Button 
          size="sm" 
          bgGradient={colors.buttons.primary}
          color="white"
          _hover={{ bgGradient: colors.buttons.primaryHover }}
          onClick={() => navigate('/signup')}
        >
          Sign Up Free
        </Button>
      </Alert>
    </MotionBox>
  );
};

const DashboardPage = () => {
  const toast = useToast();
  const { isAuthenticated, refreshUserData } = useAuth();
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);

  const handleHistoryRefresh = useCallback(async () => {
    try {
      const items = await fetchHistory();
      setHistory(items);
    } catch (error) {
      // Only show toast if it's not a network error (to avoid spam)
      if (error.code !== 'ERR_NETWORK' && error.message !== 'Network Error') {
        console.error('Error fetching history:', error);
        toast({
          title: 'Unable to load history',
          status: 'warning',
          duration: 4000,
        });
      }
    }
  }, [toast]);

  // Check server health on mount and periodically
  useEffect(() => {
    const checkHealth = async () => {
      const isOnline = await checkServerHealth();
      setServerOnline(isOnline);
      if (!isOnline) {
        toast({
          title: 'Server connection issue',
          description: 'Unable to connect to the server. Please ensure the server is running.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    checkHealth();
    const healthInterval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(healthInterval);
  }, [toast]);

  useEffect(() => {
    handleHistoryRefresh();
  }, [handleHistoryRefresh]);

  const handleAnalyze = async (channelId) => {
    setLoading(true);
    try {
      // Check server health before making request
      const isOnline = await checkServerHealth();
      if (!isOnline) {
        setServerOnline(false);
        throw new Error('Server is not available. Please ensure the server is running on port 5000.');
      }
      setServerOnline(true);

      const data = await analyzeChannel(channelId);
      setReport(data);
      
      // Refresh user data to get updated analysis count from backend
      if (isAuthenticated) {
        await refreshUserData();
      }
      
      toast({
        title: 'Analysis ready! 🎉',
        description: `${data.channelTitle} engagement calculated successfully.`,
        status: 'success',
        duration: 4000,
      });
      handleHistoryRefresh();
    } catch (error) {
      console.error('Error analyzing channel:', error);
      
      // Determine error message based on error type
      let errorTitle = 'Something went wrong';
      let errorMessage = error.response?.data?.message || error.message || 'Failed to analyze channel';
      
      // Check for network-related errors
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || error.message.includes('connect')) {
        errorTitle = 'Connection Error';
        errorMessage = 'Unable to connect to the server. Please check:\n1. The server is running on port 5000\n2. Your network connection is active\n3. No firewall is blocking the connection';
        setServerOnline(false);
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorTitle = 'Request Timeout';
        errorMessage = 'The request took too long. The server might be overloaded. Please try again.';
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const summaryCopy = useMemo(() => {
    if (!report) return null;
    return `Average engagement rate of ${report.channelEngagementRate}% across the latest ${report.videos.length} videos.`;
  }, [report]);

  return (
    <Box minH="100vh" bgGradient={colors.dashboard.gradient}>
      <DashboardHeader />
      <LoadingOverlay isVisible={loading} label="Crunching channel insights..." />
      
      <Container maxW="6xl" py={{ base: 6, md: 10 }}>
        <VStack spacing={8} align="stretch">
          {/* Page Header */}
          <MotionBox
            {...animations.fadeInUp}
          >
            <Flex direction="column" gap={4}>
              <Heading size="2xl" color="white">
                YouTube Engagement Analyzer
              </Heading>
              <Text color="gray.400" fontSize="lg" maxW="3xl">
                Paste any YouTube Channel ID to instantly benchmark subscriber counts, calculate
                average engagement, and inspect the latest content performance.
              </Text>
            </Flex>
          </MotionBox>

          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* Server Status Alert */}
          {!serverOnline && (
            <MotionBox
              {...animations.scaleIn}
            >
              <Alert status="warning" borderRadius="lg">
                <AlertIcon />
                <AlertDescription>
                  Server connection issue detected. Please ensure the backend server is running on port 5000.
                </AlertDescription>
              </Alert>
            </MotionBox>
          )}

          {/* Analyze Form */}
          <MotionBox
            {...animations.fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AnalyzeForm onAnalyze={handleAnalyze} isLoading={loading} />
          </MotionBox>

          {/* Results Section */}
          {report && (
            <MotionBox
              {...animations.fadeInUp}
            >
              <VStack spacing={6} align="stretch">
                <KpiCards report={report} />
                <Text color="gray.300" fontSize="md" textAlign="center">
                  {summaryCopy}
                </Text>
                <VideoCharts videos={report.videos} />
                <VideoTable videos={report.videos} />
              </VStack>
            </MotionBox>
          )}

          {/* History Section */}
          <MotionBox
            {...animations.fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Divider borderColor="gray.700" />
            <HistoryPanel history={history} onSelect={setReport} />
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

export default DashboardPage;

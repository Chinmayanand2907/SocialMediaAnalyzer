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
} from '@chakra-ui/react';
import AnalyzeForm from './components/AnalyzeForm';
import KpiCards from './components/KpiCards';
import VideoCharts from './components/VideoCharts';
import VideoTable from './components/VideoTable';
import HistoryPanel from './components/HistoryPanel';
import LoadingOverlay from './components/LoadingOverlay';
import { analyzeChannel, fetchHistory, checkServerHealth } from './services/api';
import './App.css';

function App() {
  const toast = useToast();
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
      toast({
        title: 'Analysis ready',
        description: `${data.channelTitle} engagement calculated.`,
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
    <Box minH="100vh" bgGradient="linear(to-b, gray.900, gray.950)">
      <LoadingOverlay isVisible={loading} label="Crunching channel insights..." />
      <Container maxW="6xl" py={{ base: 10, md: 16 }}>
        <VStack spacing={10} align="stretch">
          <Flex direction="column" gap={4}>
            <Heading size="2xl" color="white">
              YouTube Engagement Analyzer
            </Heading>
            <Text color="gray.400" fontSize="lg" maxW="3xl">
              Paste any YouTube Channel ID to instantly benchmark subscriber counts, calculate
              average engagement, and inspect the latest content performance.
            </Text>
          </Flex>

          {!serverOnline && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <AlertDescription>
                Server connection issue detected. Please ensure the backend server is running on port 5000.
              </AlertDescription>
            </Alert>
          )}

          <AnalyzeForm onAnalyze={handleAnalyze} isLoading={loading} />

          {report && (
            <>
              <KpiCards report={report} />
              <Text color="gray.300" fontSize="md">
                {summaryCopy}
              </Text>
              <VideoCharts videos={report.videos} />
              <VideoTable videos={report.videos} />
            </>
          )}

          <Divider borderColor="gray.700" />
          <HistoryPanel history={history} onSelect={setReport} />
        </VStack>
      </Container>
    </Box>
  );
}

export default App;

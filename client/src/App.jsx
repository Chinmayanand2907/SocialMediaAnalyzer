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
} from '@chakra-ui/react';
import AnalyzeForm from './components/AnalyzeForm';
import KpiCards from './components/KpiCards';
import VideoCharts from './components/VideoCharts';
import VideoTable from './components/VideoTable';
import HistoryPanel from './components/HistoryPanel';
import LoadingOverlay from './components/LoadingOverlay';
import { analyzeChannel, fetchHistory } from './services/api';
import './App.css';

function App() {
  const toast = useToast();
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleHistoryRefresh = useCallback(async () => {
    try {
      const items = await fetchHistory();
      setHistory(items);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Unable to load history',
        status: 'warning',
        duration: 4000,
      });
    }
  }, [toast]);

  useEffect(() => {
    handleHistoryRefresh();
  }, [handleHistoryRefresh]);

  const handleAnalyze = async (channelId) => {
    setLoading(true);
    try {
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
      const message = error.response?.data?.message || 'Failed to analyze channel';
      toast({
        title: 'Something went wrong',
        description: message,
        status: 'error',
        duration: 5000,
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

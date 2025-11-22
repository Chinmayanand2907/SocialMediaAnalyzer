import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  Tooltip,
  VStack,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Image,
} from '@chakra-ui/react';
import { MdArrowBack, MdFileDownload, MdShare, MdSlideshow } from 'react-icons/md';
import AnalyzeForm from './components/AnalyzeForm';
import KpiCards from './components/KpiCards';
import VideoCharts from './components/VideoCharts';
import VideoTable from './components/VideoTable';
import HistoryPanel from './components/HistoryPanel';
import LoadingOverlay from './components/LoadingOverlay';
import LandingPage from './components/LandingPage';
import VideoHeatmap from './components/VideoHeatmap';
import PresentationView from './components/PresentationView';
import { analyzeChannel, fetchHistory, checkServerHealth } from './services/api';
import { exportToCSV, exportToPDF } from './utils/exportUtils';
import { copyShareableLink, parseShareableLink, shareViaWebAPI, generateQRCode } from './utils/shareUtils';
import './App.css';

function App() {
  const toast = useToast();
  const [showLanding, setShowLanding] = useState(true);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState(true);
  const [showPresentation, setShowPresentation] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const { isOpen: isShareOpen, onOpen: onShareOpen, onClose: onShareClose } = useDisclosure();

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
    
    // Check for shared report in URL
    const sharedReport = parseShareableLink();
    if (sharedReport) {
      setReport(sharedReport);
      setShowLanding(false);
      toast({
        title: 'Shared report loaded',
        description: `Viewing analysis for ${sharedReport.channelTitle}`,
        status: 'info',
        duration: 4000,
      });
    }
  }, [handleHistoryRefresh, toast]);

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

  const handleExportCSV = () => {
    if (!report) return;
    try {
      exportToCSV(report);
      toast({
        title: 'Export successful',
        description: 'Report exported as CSV file.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error.message,
        status: 'error',
        duration: 4000,
      });
    }
  };

  const handleExportPDF = () => {
    if (!report) return;
    try {
      exportToPDF(report);
      toast({
        title: 'Export successful',
        description: 'Report exported as PDF file.',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: error.message,
        status: 'error',
        duration: 4000,
      });
    }
  };

  const handleShare = async () => {
    if (!report) return;
    
    try {
      const result = await copyShareableLink(report);
      setShareUrl(result.url);
      
      // Generate QR code
      const qrUrl = await generateQRCode(report);
      setQrCodeUrl(qrUrl);
      
      onShareOpen();
      
      toast({
        title: 'Link copied!',
        description: 'Shareable link copied to clipboard',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Share failed',
        description: error.message,
        status: 'error',
        duration: 4000,
      });
    }
  };

  const handleWebShare = async () => {
    if (!report) return;
    
    try {
      await shareViaWebAPI(report);
    } catch (error) {
      if (error.message.includes('not supported')) {
        handleShare(); // Fallback to copy link
      } else {
        toast({
          title: 'Share failed',
          description: error.message,
          status: 'error',
          duration: 4000,
        });
      }
    }
  };

  const handlePresentation = () => {
    if (!report) return;
    setShowPresentation(true);
  };

  const summaryCopy = useMemo(() => {
    if (!report) return null;
    return `Average engagement rate of ${report.channelEngagementRate}% across the latest ${report.videos.length} videos.`;
  }, [report]);

  if (showLanding) {
    return <LandingPage onNavigateToAnalyzer={() => setShowLanding(false)} />;
  }

  if (showPresentation && report) {
    return <PresentationView report={report} />;
  }

  return (
    <Box minH="100vh" bgGradient="linear(to-b, gray.900, gray.950)">
      <LoadingOverlay isVisible={loading} label="Crunching channel insights..." />
      <Container maxW="6xl" py={{ base: 10, md: 16 }}>
        <VStack spacing={10} align="stretch">
          <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} gap={4}>
            <Flex direction="column" gap={4}>
              <HStack>
                <Tooltip label="Back to Home">
                  <IconButton
                    icon={<MdArrowBack />}
                    onClick={() => setShowLanding(true)}
                    variant="ghost"
                    colorScheme="blue"
                    size="lg"
                    aria-label="Back to landing page"
                  />
                </Tooltip>
                <Heading size="2xl" color="white">
                  YouTube Engagement Analyzer
                </Heading>
              </HStack>
              <Text color="gray.400" fontSize="lg" maxW="3xl">
                Paste any YouTube Channel ID to instantly benchmark subscriber counts, calculate
                average engagement, and inspect the latest content performance.
              </Text>
            </Flex>

            {report && (
              <HStack spacing={3} flexWrap="wrap">
                <Tooltip label="Export as CSV">
                  <Button
                    leftIcon={<MdFileDownload />}
                    colorScheme="green"
                    variant="outline"
                    onClick={handleExportCSV}
                    size="md"
                  >
                    CSV
                  </Button>
                </Tooltip>
                <Tooltip label="Export as PDF">
                  <Button
                    leftIcon={<MdFileDownload />}
                    colorScheme="blue"
                    variant="outline"
                    onClick={handleExportPDF}
                    size="md"
                  >
                    PDF
                  </Button>
                </Tooltip>
                <Tooltip label="Share Report">
                  <Button
                    leftIcon={<MdShare />}
                    colorScheme="purple"
                    variant="outline"
                    onClick={handleWebShare}
                    size="md"
                  >
                    Share
                  </Button>
                </Tooltip>
                <Tooltip label="Presentation Mode">
                  <Button
                    leftIcon={<MdSlideshow />}
                    colorScheme="orange"
                    variant="outline"
                    onClick={handlePresentation}
                    size="md"
                  >
                    Present
                  </Button>
                </Tooltip>
              </HStack>
            )}
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
              <VideoHeatmap videos={report.videos} />
              <VideoCharts videos={report.videos} />
              <VideoTable videos={report.videos} />
            </>
          )}

          <Divider borderColor="gray.700" />
          <HistoryPanel history={history} onSelect={setReport} />
        </VStack>
      </Container>

      {/* Share Modal */}
      <Modal isOpen={isShareOpen} onClose={onShareClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Share Report</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text mb={2} fontSize="sm" color="gray.400">
                  Shareable Link:
                </Text>
                <HStack>
                  <Input
                    value={shareUrl}
                    readOnly
                    bg="gray.900"
                    border="1px solid"
                    borderColor="gray.700"
                    _focus={{ borderColor: 'blue.500' }}
                  />
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      toast({
                        title: 'Copied!',
                        status: 'success',
                        duration: 2000,
                      });
                    }}
                  >
                    Copy
                  </Button>
                </HStack>
              </Box>

              {qrCodeUrl && (
                <Box textAlign="center">
                  <Text mb={2} fontSize="sm" color="gray.400">
                    Scan QR Code to Share:
                  </Text>
                  <Image
                    src={qrCodeUrl}
                    alt="QR Code"
                    mx="auto"
                    borderRadius="md"
                    bg="white"
                    p={2}
                    maxW="250px"
                  />
                </Box>
              )}

              <Text fontSize="xs" color="gray.500" textAlign="center">
                Anyone with this link can view this report
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default App;

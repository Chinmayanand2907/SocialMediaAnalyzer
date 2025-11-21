import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Stack,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Image,
  Flex
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaYoutube, FaChartLine, FaUsers, FaEye, FaThumbsUp, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { colors, animations } from '../theme/colors';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <MotionCard
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      borderRadius="xl"
      p={6}
      h="full"
      {...animations.fadeInUp}
      transition={{ duration: 0.5, delay }}
      {...animations.hoverLift}
    >
      <CardBody p={0}>
        <VStack align="start" spacing={4}>
          <Box
            p={3}
            borderRadius="lg"
            bg="blue.50"
            color="blue.500"
          >
            <Icon as={icon} boxSize={6} />
          </Box>
          <Heading size="md" color="gray.800">
            {title}
          </Heading>
          <Text color="gray.600" fontSize="sm">
            {description}
          </Text>
        </VStack>
      </CardBody>
    </MotionCard>
  );
};

const StatCard = ({ number, label, icon }) => (
  <VStack spacing={2}>
    <Icon as={icon} boxSize={8} color="blue.400" />
    <Text fontSize="2xl" fontWeight="bold" color="white">
      {number}
    </Text>
    <Text fontSize="sm" color="gray.300">
      {label}
    </Text>
  </VStack>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Hero Section */}
      <Box
        bgGradient={colors.landing.gradient}
        color="white"
        py={20}
        position="relative"
        overflow="hidden"
      >
        {/* Background Pattern */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          opacity={0.1}
          bgImage={colors.landing.pattern}
          bgSize={colors.landing.patternSize}
        />
        
        <Container maxW="6xl" position="relative">
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            spacing={12}
            align="center"
          >
            <VStack align={{ base: 'center', lg: 'start' }} spacing={8} flex={1}>
              <MotionBox
                {...animations.fadeInLeft}
              >
                <Badge
                  colorScheme="blue"
                  px={4}
                  py={2}
                  borderRadius="full"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  🚀 Free YouTube Analytics Tool
                </Badge>
              </MotionBox>

              <MotionBox
                {...animations.fadeInLeft}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Heading
                  size="3xl"
                  lineHeight="shorter"
                  textAlign={{ base: 'center', lg: 'left' }}
                >
                  Analyze YouTube Channels
                  <Text as="span" color="yellow.300">
                    {' '}Like a Pro
                  </Text>
                </Heading>
              </MotionBox>

              <MotionBox
                {...animations.fadeInLeft}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Text
                  fontSize="xl"
                  color="gray.200"
                  maxW="500px"
                  textAlign={{ base: 'center', lg: 'left' }}
                >
                  Get instant insights into engagement rates, subscriber growth, and content performance. 
                  Make data-driven decisions for your YouTube strategy.
                </Text>
              </MotionBox>

              <MotionBox
                {...animations.fadeInUp}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <HStack spacing={4}>
                  <Button
                    size="lg"
                    px={8}
                    py={6}
                    fontSize="lg"
                    fontWeight="bold"
                    borderRadius="full"
                    bgGradient={colors.buttons.success}
                    color="white"
                    _hover={{ 
                      bgGradient: colors.buttons.successHover,
                      transform: 'translateY(-2px)', 
                      boxShadow: 'xl' 
                    }}
                    onClick={() => navigate('/signup')}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    borderColor="white"
                    color="white"
                    px={8}
                    py={6}
                    fontSize="lg"
                    borderRadius="full"
                    _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </HStack>
              </MotionBox>
            </VStack>

            {/* Stats Section */}
            <MotionBox
              flex={1}
              {...animations.fadeInRight}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <SimpleGrid columns={2} spacing={8}>
                <StatCard number="10K+" label="Analyses Done" icon={FaChartLine} />
                <StatCard number="500+" label="Happy Users" icon={FaUsers} />
                <StatCard number="1M+" label="Videos Analyzed" icon={FaEye} />
                <StatCard number="99.9%" label="Uptime" icon={FaYoutube} />
              </SimpleGrid>
            </MotionBox>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="6xl" py={20}>
        <VStack spacing={16}>
          <MotionBox
            textAlign="center"
            {...animations.fadeInUp}
          >
            <Heading size="2xl" color="gray.800" mb={4}>
              Everything You Need to Analyze YouTube
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="600px">
              Our comprehensive analytics platform gives you deep insights into any YouTube channel's performance
            </Text>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
            <FeatureCard
              icon={FaChartLine}
              title="Engagement Analytics"
              description="Track likes, comments, and engagement rates across all videos to understand what content resonates with audiences."
              delay={0.1}
            />
            <FeatureCard
              icon={FaUsers}
              title="Subscriber Insights"
              description="Monitor subscriber growth patterns and benchmark against competitors in your niche."
              delay={0.2}
            />
            <FeatureCard
              icon={FaEye}
              title="View Performance"
              description="Analyze view counts, watch time, and video performance metrics to optimize your content strategy."
              delay={0.3}
            />
            <FeatureCard
              icon={FaThumbsUp}
              title="Content Analysis"
              description="Deep dive into which types of content perform best and identify trending topics in your space."
              delay={0.4}
            />
            <FeatureCard
              icon={FaComments}
              title="Audience Engagement"
              description="Understand how audiences interact with content and identify the most engaging video formats."
              delay={0.5}
            />
            <FeatureCard
              icon={FaYoutube}
              title="Channel Comparison"
              description="Compare multiple channels side-by-side to identify opportunities and competitive advantages."
              delay={0.6}
            />
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg="gray.800" py={20}>
        <Container maxW="4xl">
          <MotionBox
            textAlign="center"
            {...animations.fadeInUp}
          >
            <VStack spacing={8}>
              <Heading size="2xl" color="white">
                Ready to Boost Your YouTube Strategy?
              </Heading>
              <Text fontSize="lg" color="gray.300" maxW="500px">
                Join thousands of creators and marketers who use our platform to make data-driven decisions
              </Text>
              <HStack spacing={4}>
                <Button
                  size="lg"
                  px={8}
                  py={6}
                  fontSize="lg"
                  fontWeight="bold"
                  borderRadius="full"
                  bgGradient={colors.buttons.primary}
                  color="white"
                  _hover={{ 
                    bgGradient: colors.buttons.primaryHover,
                    transform: 'translateY(-2px)', 
                    boxShadow: 'xl' 
                  }}
                  onClick={() => navigate('/signup')}
                >
                  Start Analyzing Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  borderColor="gray.400"
                  color="gray.300"
                  px={8}
                  py={6}
                  fontSize="lg"
                  borderRadius="full"
                  _hover={{ bg: 'whiteAlpha.200', transform: 'translateY(-2px)' }}
                  onClick={() => navigate('/login')}
                >
                  I Have an Account
                </Button>
              </HStack>
            </VStack>
          </MotionBox>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;

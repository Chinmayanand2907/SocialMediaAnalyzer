import { Box, Button, Container, Flex, Heading, Icon, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { MdBarChart, MdHistory, MdTrendingUp, MdVideoLibrary } from 'react-icons/md';
import PropTypes from 'prop-types';

const Feature = ({ icon, title, description }) => {
  return (
    <VStack
      bg="gray.800"
      p={8}
      borderRadius="2xl"
      border="1px solid"
      borderColor="gray.700"
      spacing={4}
      align="start"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-8px)', borderColor: 'blue.500', boxShadow: '0 10px 40px rgba(66, 153, 225, 0.3)' }}
    >
      <Icon as={icon} boxSize={12} color="blue.400" />
      <Heading size="md" color="white">
        {title}
      </Heading>
      <Text color="gray.400" fontSize="md">
        {description}
      </Text>
    </VStack>
  );
};

Feature.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const LandingPage = ({ onNavigateToAnalyzer }) => {
  const features = [
    {
      icon: MdBarChart,
      title: 'Real-Time Analytics',
      description: 'Get instant insights into channel performance, subscriber count, and engagement metrics.',
    },
    {
      icon: MdVideoLibrary,
      title: 'Video Performance',
      description: 'Analyze the latest 10 videos with detailed views, likes, and comments breakdown.',
    },
    {
      icon: MdTrendingUp,
      title: 'Engagement Rate',
      description: 'Calculate and track average engagement rates across all analyzed videos.',
    },
    {
      icon: MdHistory,
      title: 'Analysis History',
      description: 'Save and review past channel analyses to track growth trends over time.',
    },
  ];

  return (
    <Box minH="100vh" bgGradient="linear(to-b, gray.900, gray.950)">
      <Container maxW="7xl" py={{ base: 16, md: 24 }}>
        <VStack spacing={{ base: 16, md: 20 }} align="stretch">
          {/* Hero Section */}
          <Flex
            direction="column"
            align="center"
            textAlign="center"
            gap={8}
            pt={{ base: 8, md: 16 }}
          >
            <VStack spacing={6} maxW="4xl">
              <Heading
                size="4xl"
                bgGradient="linear(to-r, blue.400, purple.400)"
                bgClip="text"
                fontWeight="extrabold"
                lineHeight="1.2"
              >
                YouTube Engagement Analyzer
              </Heading>
              <Text color="gray.300" fontSize={{ base: 'xl', md: '2xl' }} maxW="3xl" lineHeight="tall">
                Unlock powerful insights into any YouTube channel. Analyze engagement metrics,
                track performance, and make data-driven decisions.
              </Text>
            </VStack>

            <Flex gap={4} direction={{ base: 'column', sm: 'row' }} w={{ base: 'full', sm: 'auto' }}>
              <Button
                size="lg"
                colorScheme="blue"
                px={8}
                py={7}
                fontSize="xl"
                borderRadius="xl"
                boxShadow="0 8px 32px rgba(66, 153, 225, 0.4)"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(66, 153, 225, 0.5)',
                }}
                transition="all 0.3s"
                onClick={onNavigateToAnalyzer}
              >
                Open Analyzer
              </Button>
              <Button
                size="lg"
                variant="outline"
                colorScheme="blue"
                px={8}
                py={7}
                fontSize="xl"
                borderRadius="xl"
                _hover={{
                  bg: 'blue.900',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.3s"
                as="a"
                href="https://github.com"
                target="_blank"
              >
                View on GitHub
              </Button>
            </Flex>
          </Flex>

          {/* Features Section */}
          <VStack spacing={12} pt={8}>
            <VStack spacing={4} textAlign="center">
              <Heading size="2xl" color="white">
                Powerful Features
              </Heading>
              <Text color="gray.400" fontSize="lg" maxW="2xl">
                Everything you need to understand and optimize YouTube channel performance
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {features.map((feature, index) => (
                <Feature key={index} {...feature} />
              ))}
            </SimpleGrid>
          </VStack>

          {/* CTA Section */}
          <Box
            bg="gray.800"
            borderRadius="3xl"
            border="1px solid"
            borderColor="gray.700"
            p={{ base: 8, md: 12 }}
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top="-50%"
              right="-10%"
              w="400px"
              h="400px"
              bgGradient="radial(blue.500, transparent)"
              opacity={0.1}
              filter="blur(60px)"
            />
            <VStack spacing={6} position="relative" zIndex={1}>
              <Heading size="xl" color="white">
                Ready to Get Started?
              </Heading>
              <Text color="gray.300" fontSize="lg" maxW="2xl">
                Start analyzing YouTube channels in seconds. No signup required.
              </Text>
              <Button
                size="lg"
                colorScheme="blue"
                px={10}
                py={7}
                fontSize="xl"
                borderRadius="xl"
                onClick={onNavigateToAnalyzer}
                boxShadow="0 8px 32px rgba(66, 153, 225, 0.4)"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(66, 153, 225, 0.5)',
                }}
                transition="all 0.3s"
              >
                Launch Analyzer
              </Button>
            </VStack>
          </Box>

          {/* Footer */}
          <Text textAlign="center" color="gray.500" fontSize="sm" pt={8}>
            © 2025 YouTube Engagement Analyzer. Built with React, Node.js, and MongoDB.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

LandingPage.propTypes = {
  onNavigateToAnalyzer: PropTypes.func.isRequired,
};

export default LandingPage;

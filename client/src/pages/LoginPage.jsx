import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Link,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  useColorModeValue,
  Card,
  CardBody,
  Image,
  Flex
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { colors, animations } from '../theme/colors';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    clearError();
    const result = await login(data);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <Box minH="100vh" bgGradient={colors.login.gradient}>
      {/* Background Pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        bgImage={colors.login.pattern}
        bgSize={colors.login.patternSize}
      />

      <Container maxW="md" py={20} position="relative">
        <VStack spacing={8}>
          {/* Back to Home Button */}
          <HStack w="full" justify="start">
            <Button
              leftIcon={<ArrowBackIcon />}
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </HStack>

          {/* Login Card */}
          <MotionCard
            bg={bgColor}
            borderRadius="2xl"
            border="1px"
            borderColor={borderColor}
            boxShadow="2xl"
            w="full"
            {...animations.fadeInUp}
          >
            <CardBody p={10}>
              <VStack spacing={8} align="stretch">
                {/* Header */}
                <Box textAlign="center">
                  <Heading size="xl" mb={2} bgGradient={colors.buttons.primary} bgClip="text">
                    Welcome Back
                  </Heading>
                  <Text color="gray.500" fontSize="lg">
                    Sign in to continue analyzing YouTube channels
                  </Text>
                </Box>

                {/* Error Alert */}
                {error && (
                  <MotionBox
                    {...animations.scaleIn}
                  >
                    <Alert status="error" borderRadius="lg">
                      <AlertIcon />
                      {error}
                    </Alert>
                  </MotionBox>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={6}>
                    <FormControl isInvalid={errors.identifier}>
                      <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                        Email or Username
                      </FormLabel>
                      <Input
                        type="text"
                        placeholder="Enter your email or username"
                        size="lg"
                        borderRadius="lg"
                        bg="gray.50"
                        border="2px"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'blue.300' }}
                        _focus={{ borderColor: 'blue.500', bg: 'white' }}
                        {...register('identifier', {
                          required: 'Email or username is required',
                          minLength: {
                            value: 3,
                            message: 'Must be at least 3 characters'
                          }
                        })}
                      />
                      {errors.identifier && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.identifier.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.password}>
                      <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                        Password
                      </FormLabel>
                      <InputGroup>
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          size="lg"
                          borderRadius="lg"
                          bg="gray.50"
                          border="2px"
                          borderColor="gray.200"
                          _hover={{ borderColor: 'blue.300' }}
                          _focus={{ borderColor: 'blue.500', bg: 'white' }}
                          {...register('password', {
                            required: 'Password is required',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters'
                            }
                          })}
                        />
                        <InputRightElement h="full">
                          <IconButton
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          />
                        </InputRightElement>
                      </InputGroup>
                      {errors.password && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.password.message}
                        </Text>
                      )}
                    </FormControl>

                    <Button
                      type="submit"
                      size="lg"
                      w="full"
                      borderRadius="lg"
                      bgGradient={colors.buttons.primary}
                      color="white"
                      _hover={{ 
                        bgGradient: colors.buttons.primaryHover, 
                        transform: 'translateY(-1px)' 
                      }}
                      isLoading={isSubmitting || loading}
                      loadingText="Signing in..."
                      py={6}
                      fontSize="lg"
                      fontWeight="bold"
                    >
                      Sign In
                    </Button>
                  </VStack>
                </form>

                <Divider />

                {/* Sign Up Link */}
                <Box textAlign="center">
                  <Text color="gray.600">
                    Don&apos;t have an account?{' '}
                    <Link
                      as={RouterLink}
                      to="/signup"
                      color="blue.500"
                      fontWeight="semibold"
                      _hover={{ color: 'blue.600', textDecoration: 'underline' }}
                    >
                      Sign up for free
                    </Link>
                  </Text>
                </Box>

                {/* Demo Account */}
                <Box textAlign="center" pt={4} borderTop="1px" borderColor="gray.100">
                  <Text fontSize="sm" color="gray.500" mb={2}>
                    Want to try without signing up?
                  </Text>
                  <Button
                    variant="outline"
                    size="sm"
                    colorScheme="gray"
                    onClick={() => navigate('/dashboard')}
                  >
                    Continue as Guest
                  </Button>
                </Box>
              </VStack>
            </CardBody>
          </MotionCard>

          {/* Footer */}
          <Text color="whiteAlpha.700" fontSize="sm" textAlign="center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default LoginPage;

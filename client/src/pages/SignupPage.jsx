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
  Progress,
  Badge
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, ArrowBackIcon, CheckIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { colors, animations } from '../theme/colors';

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const strength = getStrength(password);
  const strengthColors = ['red', 'orange', 'yellow', 'blue', 'green'];
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password || password.length === 0) return null;

  // Ensure we don't access negative array indices
  const colorIndex = Math.max(0, strength - 1);
  const safeColorIndex = Math.min(colorIndex, strengthColors.length - 1);

  return (
    <VStack spacing={2} align="stretch" mt={2}>
      <Progress
        value={(strength / 5) * 100}
        colorScheme={strengthColors[safeColorIndex]}
        size="sm"
        borderRadius="full"
      />
      <HStack justify="space-between">
        <Text fontSize="xs" color="gray.500">
          Password Strength: <Text as="span" color={`${strengthColors[safeColorIndex]}.500`} fontWeight="medium">
            {labels[safeColorIndex]}
          </Text>
        </Text>
        {strength >= 3 && <CheckIcon color="green.500" boxSize={3} />}
      </HStack>
    </VStack>
  );
};

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const password = watch('password');

  // Redirect if already authenticated (but only after initial load)
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const onSubmit = async (data) => {
    clearError();
    const result = await registerUser(data);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  // Early return for debugging
  if (loading) {
    return (
      <Box minH="100vh" bg="gray.900" display="flex" alignItems="center" justifyContent="center">
        <Text color="white" fontSize="xl">Loading...</Text>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bgGradient={colors.signup.gradient}>
      {/* Background Pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        bgImage={colors.signup.pattern}
        bgSize={colors.signup.patternSize}
      />

      <Container maxW="lg" py={12} position="relative">
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

          {/* Signup Card */}
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
                  <Badge
                    colorScheme="purple"
                    px={4}
                    py={2}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="medium"
                    mb={4}
                  >
                    🎉 Join for Free
                  </Badge>
                  <Heading size="xl" mb={2} bgGradient={colors.buttons.secondary} bgClip="text">
                    Create Your Account
                  </Heading>
                  <Text color="gray.500" fontSize="lg">
                    Start analyzing YouTube channels in seconds
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

                {/* Signup Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={6}>
                    <HStack spacing={4} w="full">
                      <FormControl isInvalid={errors.firstName}>
                        <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                          First Name
                        </FormLabel>
                        <Input
                          type="text"
                          placeholder="John"
                          size="lg"
                          borderRadius="lg"
                          bg="gray.50"
                          border="2px"
                          borderColor="gray.200"
                          _hover={{ borderColor: 'purple.300' }}
                          _focus={{ borderColor: 'purple.500', bg: 'white' }}
                          {...register('firstName', {
                            required: 'First name is required',
                            minLength: {
                              value: 2,
                              message: 'Must be at least 2 characters'
                            },
                            maxLength: {
                              value: 50,
                              message: 'Cannot exceed 50 characters'
                            }
                          })}
                        />
                        {errors.firstName && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.firstName.message}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl isInvalid={errors.lastName}>
                        <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                          Last Name
                        </FormLabel>
                        <Input
                          type="text"
                          placeholder="Doe"
                          size="lg"
                          borderRadius="lg"
                          bg="gray.50"
                          border="2px"
                          borderColor="gray.200"
                          _hover={{ borderColor: 'purple.300' }}
                          _focus={{ borderColor: 'purple.500', bg: 'white' }}
                          {...register('lastName', {
                            required: 'Last name is required',
                            minLength: {
                              value: 2,
                              message: 'Must be at least 2 characters'
                            },
                            maxLength: {
                              value: 50,
                              message: 'Cannot exceed 50 characters'
                            }
                          })}
                        />
                        {errors.lastName && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {errors.lastName.message}
                          </Text>
                        )}
                      </FormControl>
                    </HStack>

                    <FormControl isInvalid={errors.username}>
                      <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                        Username
                      </FormLabel>
                      <Input
                        type="text"
                        placeholder="johndoe123"
                        size="lg"
                        borderRadius="lg"
                        bg="gray.50"
                        border="2px"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'purple.300' }}
                        _focus={{ borderColor: 'purple.500', bg: 'white' }}
                        {...register('username', {
                          required: 'Username is required',
                          minLength: {
                            value: 3,
                            message: 'Must be at least 3 characters'
                          },
                          maxLength: {
                            value: 30,
                            message: 'Cannot exceed 30 characters'
                          },
                          pattern: {
                            value: /^[a-zA-Z0-9_]+$/,
                            message: 'Username can only contain letters, numbers, and underscores'
                          }
                        })}
                      />
                      {errors.username && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.username.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.email}>
                      <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                        Email Address
                      </FormLabel>
                      <Input
                        type="email"
                        placeholder="john@example.com"
                        size="lg"
                        borderRadius="lg"
                        bg="gray.50"
                        border="2px"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'purple.300' }}
                        _focus={{ borderColor: 'purple.500', bg: 'white' }}
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                            message: 'Please enter a valid email address'
                          }
                        })}
                      />
                      {errors.email && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.email.message}
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
                          placeholder="Create a strong password"
                          size="lg"
                          borderRadius="lg"
                          bg="gray.50"
                          border="2px"
                          borderColor="gray.200"
                          _hover={{ borderColor: 'purple.300' }}
                          _focus={{ borderColor: 'purple.500', bg: 'white' }}
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
                      <PasswordStrengthIndicator password={password} />
                      {errors.password && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.password.message}
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={errors.confirmPassword}>
                      <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                        Confirm Password
                      </FormLabel>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        size="lg"
                        borderRadius="lg"
                        bg="gray.50"
                        border="2px"
                        borderColor="gray.200"
                        _hover={{ borderColor: 'purple.300' }}
                        _focus={{ borderColor: 'purple.500', bg: 'white' }}
                        {...register('confirmPassword', {
                          required: 'Please confirm your password',
                          validate: (value) =>
                            value === password || 'Passwords do not match'
                        })}
                      />
                      {errors.confirmPassword && (
                        <Text color="red.500" fontSize="sm" mt={1}>
                          {errors.confirmPassword.message}
                        </Text>
                      )}
                    </FormControl>

                    <Button
                      type="submit"
                      size="lg"
                      w="full"
                      borderRadius="lg"
                      bgGradient={colors.buttons.secondary}
                      color="white"
                      _hover={{ 
                        bgGradient: colors.buttons.secondaryHover, 
                        transform: 'translateY(-1px)' 
                      }}
                      isLoading={isSubmitting || loading}
                      loadingText="Creating account..."
                      py={6}
                      fontSize="lg"
                      fontWeight="bold"
                    >
                      Create Account
                    </Button>
                  </VStack>
                </form>

                <Divider />

                {/* Login Link */}
                <Box textAlign="center">
                  <Text color="gray.600">
                    Already have an account?{' '}
                    <Link
                      as={RouterLink}
                      to="/login"
                      color="purple.500"
                      fontWeight="semibold"
                      _hover={{ color: 'purple.600', textDecoration: 'underline' }}
                    >
                      Sign in here
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
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default SignupPage;

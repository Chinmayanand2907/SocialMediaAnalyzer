import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Avatar,
  Text,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { colors } from '../theme/colors';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, changePassword, loading } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    reset: resetProfile
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword,
    watch
  } = useForm();

  const newPassword = watch('newPassword');

  // Reset forms when user data changes or modal opens
  React.useEffect(() => {
    if (user && isOpen) {
      resetProfile({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
    }
  }, [user, isOpen, resetProfile]);

  const onProfileSubmit = async (data) => {
    const result = await updateProfile(data);
    if (result.success) {
      // Profile updated successfully
    }
  };

  const onPasswordSubmit = async (data) => {
    const { currentPassword, newPassword } = data;
    const result = await changePassword({ currentPassword, newPassword });
    if (result.success) {
      resetPassword();
      setActiveTab(0); // Switch back to profile tab
    }
  };

  const handleClose = () => {
    resetPassword();
    setActiveTab(0);
    onClose();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent bg="gray.800" color="white" borderRadius="xl" border="1px" borderColor="gray.700">
        <ModalHeader color="white" borderBottom="1px" borderColor="gray.700">Account Settings</ModalHeader>
        <ModalCloseButton color="gray.400" _hover={{ color: 'white', bg: 'gray.700' }} />
        
        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab}>
            <TabList borderColor="gray.700">
              <Tab color="gray.400" _selected={{ color: 'white', borderColor: 'blue.400' }} _hover={{ color: 'white' }}>Profile</Tab>
              <Tab color="gray.400" _selected={{ color: 'white', borderColor: 'blue.400' }} _hover={{ color: 'white' }}>Security</Tab>
            </TabList>

            <TabPanels>
              {/* Profile Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  <HStack spacing={4} p={4} bg="gray.700" borderRadius="md" border="1px" borderColor="gray.600">
                    <Avatar
                      size="lg"
                      name={user.fullName}
                      src={user.avatar}
                      bg="blue.500"
                    />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" fontSize="lg">
                        {user.fullName}
                      </Text>
                      <Text color="gray.400" fontSize="sm">
                        @{user.username}
                      </Text>
                      <Badge colorScheme="green" variant="subtle">
                        Member since {new Date(user.createdAt).getFullYear()}
                      </Badge>
                    </VStack>
                  </HStack>

                  <Divider borderColor="gray.600" />

                  <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                    <VStack spacing={4}>
                      <HStack spacing={4} w="full">
                        <FormControl isInvalid={profileErrors.firstName}>
                          <FormLabel color="gray.300">First Name</FormLabel>
                          <Input
                            bg="gray.700"
                            border="1px"
                            borderColor="gray.600"
                            color="white"
                            _hover={{ borderColor: 'gray.500' }}
                            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182ce' }}
                            {...registerProfile('firstName', {
                              required: 'First name is required',
                              minLength: {
                                value: 2,
                                message: 'Must be at least 2 characters'
                              }
                            })}
                          />
                          {profileErrors.firstName && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {profileErrors.firstName.message}
                            </Text>
                          )}
                        </FormControl>

                        <FormControl isInvalid={profileErrors.lastName}>
                          <FormLabel color="gray.300">Last Name</FormLabel>
                          <Input
                            bg="gray.700"
                            border="1px"
                            borderColor="gray.600"
                            color="white"
                            _hover={{ borderColor: 'gray.500' }}
                            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182ce' }}
                            {...registerProfile('lastName', {
                              required: 'Last name is required',
                              minLength: {
                                value: 2,
                                message: 'Must be at least 2 characters'
                              }
                            })}
                          />
                          {profileErrors.lastName && (
                            <Text color="red.500" fontSize="sm" mt={1}>
                              {profileErrors.lastName.message}
                            </Text>
                          )}
                        </FormControl>
                      </HStack>

                      <FormControl isInvalid={profileErrors.email}>
                        <FormLabel color="gray.300">Email</FormLabel>
                        <Input
                          type="email"
                          bg="gray.700"
                          border="1px"
                          borderColor="gray.600"
                          color="white"
                          _hover={{ borderColor: 'gray.500' }}
                          _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182ce' }}
                          {...registerProfile('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                              message: 'Please enter a valid email address'
                            }
                          })}
                        />
                        {profileErrors.email && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {profileErrors.email.message}
                          </Text>
                        )}
                      </FormControl>

                      <Button
                        type="submit"
                        w="full"
                        bgGradient={colors.buttons.primary}
                        color="white"
                        _hover={{ bgGradient: colors.buttons.primaryHover }}
                        isLoading={isProfileSubmitting || loading}
                        loadingText="Updating..."
                      >
                        Update Profile
                      </Button>
                    </VStack>
                  </form>
                </VStack>
              </TabPanel>

              {/* Security Tab */}
              <TabPanel px={0}>
                <VStack spacing={6} align="stretch">
                  <Alert status="info" borderRadius="md" bg="blue.900" borderColor="blue.700" border="1px">
                    <AlertIcon color="blue.300" />
                    <Text fontSize="sm" color="blue.100">
                      Choose a strong password with at least 6 characters.
                    </Text>
                  </Alert>

                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                    <VStack spacing={4}>
                      <FormControl isInvalid={passwordErrors.currentPassword}>
                        <FormLabel color="gray.300">Current Password</FormLabel>
                        <InputGroup>
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Enter your current password"
                            bg="gray.700"
                            border="1px"
                            borderColor="gray.600"
                            color="white"
                            _placeholder={{ color: 'gray.400' }}
                            _hover={{ borderColor: 'gray.500' }}
                            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182ce' }}
                            {...registerPassword('currentPassword', {
                              required: 'Current password is required'
                            })}
                          />
                          <InputRightElement>
                            <IconButton
                              variant="ghost"
                              size="sm"
                              color="gray.400"
                              _hover={{ color: 'white', bg: 'gray.600' }}
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              icon={showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
                              aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                            />
                          </InputRightElement>
                        </InputGroup>
                        {passwordErrors.currentPassword && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {passwordErrors.currentPassword.message}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl isInvalid={passwordErrors.newPassword}>
                        <FormLabel color="gray.300">New Password</FormLabel>
                        <InputGroup>
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter your new password"
                            bg="gray.700"
                            border="1px"
                            borderColor="gray.600"
                            color="white"
                            _placeholder={{ color: 'gray.400' }}
                            _hover={{ borderColor: 'gray.500' }}
                            _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182ce' }}
                            {...registerPassword('newPassword', {
                              required: 'New password is required',
                              minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                              }
                            })}
                          />
                          <InputRightElement>
                            <IconButton
                              variant="ghost"
                              size="sm"
                              color="gray.400"
                              _hover={{ color: 'white', bg: 'gray.600' }}
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                            />
                          </InputRightElement>
                        </InputGroup>
                        {passwordErrors.newPassword && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {passwordErrors.newPassword.message}
                          </Text>
                        )}
                      </FormControl>

                      <FormControl isInvalid={passwordErrors.confirmNewPassword}>
                        <FormLabel color="gray.300">Confirm New Password</FormLabel>
                        <Input
                          type="password"
                          placeholder="Confirm your new password"
                          bg="gray.700"
                          border="1px"
                          borderColor="gray.600"
                          color="white"
                          _placeholder={{ color: 'gray.400' }}
                          _hover={{ borderColor: 'gray.500' }}
                          _focus={{ borderColor: 'blue.400', boxShadow: '0 0 0 1px #3182ce' }}
                          {...registerPassword('confirmNewPassword', {
                            required: 'Please confirm your new password',
                            validate: (value) =>
                              value === newPassword || 'Passwords do not match'
                          })}
                        />
                        {passwordErrors.confirmNewPassword && (
                          <Text color="red.500" fontSize="sm" mt={1}>
                            {passwordErrors.confirmNewPassword.message}
                          </Text>
                        )}
                      </FormControl>

                      <Button
                        type="submit"
                        w="full"
                        bg="red.600"
                        color="white"
                        _hover={{ bg: 'red.700' }}
                        isLoading={isPasswordSubmitting || loading}
                        loadingText="Changing Password..."
                      >
                        Change Password
                      </Button>
                    </VStack>
                  </form>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter borderTop="1px" borderColor="gray.700">
          <Button variant="ghost" color="gray.400" _hover={{ color: 'white', bg: 'gray.700' }} onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

ProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default ProfileModal;

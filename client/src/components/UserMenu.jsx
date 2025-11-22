import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Button,
  Text,
  HStack,
  VStack,
  Box,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';

const UserMenu = ({ onOpenProfile }) => {
  const { user, logout } = useAuth();
  const menuBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        variant="ghost"
        rightIcon={<ChevronDownIcon />}
        _hover={{ bg: 'whiteAlpha.200' }}
        _active={{ bg: 'whiteAlpha.300' }}
      >
        <HStack spacing={3}>
          <Avatar
            size="sm"
            name={user.fullName}
            src={user.avatar}
            bg="blue.500"
          />
          <VStack spacing={0} align="start" display={{ base: 'none', md: 'flex' }}>
            <Text fontSize="sm" fontWeight="medium" color="white">
              {user.firstName} {user.lastName}
            </Text>
            <Text fontSize="xs" color="gray.300">
              @{user.username}
            </Text>
          </VStack>
        </HStack>
      </MenuButton>
      
      <MenuList
        bg={menuBg}
        borderColor={borderColor}
        boxShadow="lg"
        minW="250px"
      >
        <Box px={4} py={3}>
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold" fontSize="sm">
              {user.fullName}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {user.email}
            </Text>
            <Badge colorScheme="green" size="sm" mt={1}>
              Member since {new Date(user.createdAt).getFullYear()}
            </Badge>
          </VStack>
        </Box>
        
        <MenuDivider />
        
        <MenuItem onClick={onOpenProfile}>
          Profile Settings
        </MenuItem>
        
        <MenuItem>
          My Analyses
        </MenuItem>
        
        <MenuDivider />
        
        <MenuItem onClick={handleLogout} color="red.500">
          Sign Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

UserMenu.propTypes = {
  onOpenProfile: PropTypes.func
};

export default UserMenu;

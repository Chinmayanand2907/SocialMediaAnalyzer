import PropTypes from 'prop-types';
import { Flex, Spinner, Text } from '@chakra-ui/react';

const LoadingOverlay = ({ isVisible, label }) => {
  if (!isVisible) return null;

  return (
    <Flex
      position="fixed"
      inset={0}
      bg="rgba(15,23,42,0.8)"
      align="center"
      justify="center"
      zIndex={1000}
      direction="column"
      gap={4}
    >
      <Spinner size="xl" thickness="4px" color="brand.300" />
      <Text fontSize="lg" color="gray.200">
        {label}
      </Text>
    </Flex>
  );
};

LoadingOverlay.propTypes = {
  isVisible: PropTypes.bool,
  label: PropTypes.string,
};

LoadingOverlay.defaultProps = {
  isVisible: false,
  label: 'Analyzing channel...',
};

export default LoadingOverlay;


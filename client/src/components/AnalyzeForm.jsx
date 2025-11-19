import PropTypes from 'prop-types';
import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/form-control';
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const AnalyzeForm = ({ onAnalyze, isLoading }) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      channelId: '',
    },
  });

  const submitHandler = (values) => {
    let channelId = values.channelId.trim();
    // Remove UC prefix if user pasted the full channel ID
    if (channelId.startsWith('UC')) {
      channelId = channelId.substring(2);
    }
    onAnalyze(channelId);
    reset({ channelId: '' });
  };

  return (
    <Box bg="gray.800" borderRadius="2xl" p={{ base: 6, md: 8 }} boxShadow="xl">
      <VStack as="form" spacing={4} align="stretch" onSubmit={handleSubmit(submitHandler)}>
        <Heading size="md" color="gray.100">
          Analyze any YouTube channel
        </Heading>
        <FormControl isInvalid={Boolean(errors.channelId)}>
          <FormLabel color="gray.300">YouTube Channel ID</FormLabel>
          <InputGroup>
            <InputLeftAddon bg="gray.700" border="none" color="gray.200">
              UC
            </InputLeftAddon>
            <Input
              placeholder="Paste the remaining characters..."
              bg="gray.900"
              border="1px solid"
              borderColor="gray.700"
              _placeholder={{ color: 'gray.500' }}
              {...register('channelId', {
                required: 'Channel ID is required',
                minLength: { value: 5, message: 'Channel ID seems too short' },
              })}
            />
          </InputGroup>
          <FormErrorMessage>{errors.channelId && errors.channelId.message}</FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={isLoading}
          loadingText="Analyzing"
        >
          Analyze Channel
        </Button>
      </VStack>
    </Box>
  );
};

AnalyzeForm.propTypes = {
  onAnalyze: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

AnalyzeForm.defaultProps = {
  isLoading: false,
};

export default AnalyzeForm;


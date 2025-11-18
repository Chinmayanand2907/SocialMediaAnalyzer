import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Icon,
  Text,
  VStack,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import { MdHistory, MdOutlineNorthEast } from 'react-icons/md';

const HistoryPanel = ({ history, onSelect }) => {
  if (!history.length) {
    return null;
  }

  return (
    <Card bg="gray.800" border="1px solid" borderColor="gray.700" borderRadius="2xl">
      <CardHeader>
        <Flex align="center" gap={3}>
          <Icon as={MdHistory} color="brand.300" boxSize={6} />
          <Heading size="md" color="white">
            Recent analyses
          </Heading>
        </Flex>
        <Text fontSize="sm" color="gray.400">
          Tap to reload a previous report
        </Text>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" spacing={3}>
          {history.slice(0, 5).map((entry) => (
            <Tooltip key={entry._id} label="Load this report" hasArrow>
              <Button
                onClick={() => onSelect(entry)}
                variant="ghost"
                justifyContent="space-between"
                rightIcon={<MdOutlineNorthEast />}
                color="gray.100"
                border="1px solid"
                borderColor="gray.700"
                _hover={{ bg: 'gray.700' }}
              >
                <Flex direction="column" align="flex-start">
                  <Text fontWeight="semibold">{entry.channelTitle}</Text>
                  <Text fontSize="sm" color="gray.400">
                    {new Date(entry.createdAt).toLocaleString()}
                  </Text>
                </Flex>
              </Button>
            </Tooltip>
          ))}
        </VStack>
      </CardBody>
    </Card>
  );
};

HistoryPanel.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      channelTitle: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
  onSelect: PropTypes.func,
};

HistoryPanel.defaultProps = {
  history: [],
  onSelect: () => {},
};

export default HistoryPanel;


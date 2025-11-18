import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { MdSubscriptions, MdTrendingUp, MdOutlineOndemandVideo } from 'react-icons/md';

const formatter = new Intl.NumberFormat('en-US', { notation: 'compact' });

const cards = [
  {
    key: 'channelTitle',
    label: 'Channel',
    icon: MdOutlineOndemandVideo,
    getValue: (report) => report.channelTitle,
  },
  {
    key: 'totalSubscribers',
    label: 'Subscribers',
    icon: MdSubscriptions,
    getValue: (report) => formatter.format(report.totalSubscribers),
  },
  {
    key: 'channelEngagementRate',
    label: 'Avg. Engagement Rate',
    icon: MdTrendingUp,
    getValue: (report) => `${report.channelEngagementRate}%`,
  },
];

const KpiCards = ({ report }) => {
  const accent = useColorModeValue('brand.400', 'brand.200');

  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
      {cards.map((card) => (
        <Card key={card.key} bg="gray.800" borderRadius="2xl" border="1px solid" borderColor="gray.700">
          <CardBody>
            <Flex align="center" justify="space-between">
              <div>
                <Text fontSize="sm" textTransform="uppercase" color="gray.400" letterSpacing="0.08em">
                  {card.label}
                </Text>
                <Heading size="lg" mt={2} color="white">
                  {card.getValue(report)}
                </Heading>
              </div>
              <Icon as={card.icon} boxSize={10} color={accent} />
            </Flex>
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );
};

KpiCards.propTypes = {
  report: PropTypes.shape({
    channelTitle: PropTypes.string.isRequired,
    totalSubscribers: PropTypes.number.isRequired,
    channelEngagementRate: PropTypes.number.isRequired,
  }).isRequired,
};

export default KpiCards;


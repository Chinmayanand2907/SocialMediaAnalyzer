import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from '@chakra-ui/react';

const numberFormatter = new Intl.NumberFormat('en-US');

const VideoTable = ({ videos }) => (
  <Card bg="gray.800" border="1px solid" borderColor="gray.700" borderRadius="2xl">
    <CardHeader>
      <Heading size="md" color="white">
        Latest videos
      </Heading>
      <Text fontSize="sm" color="gray.400">
        Sorted by publish date (newest first)
      </Text>
    </CardHeader>
    <CardBody>
      {videos.length ? (
        <Table variant="simple" colorScheme="whiteAlpha" size="md">
          <Thead>
            <Tr>
              <Th color="gray.400">Title</Th>
              <Th color="gray.400" isNumeric>
                Views
              </Th>
              <Th color="gray.400" isNumeric>
                Likes
              </Th>
              <Th color="gray.400" isNumeric>
                Comments
              </Th>
              <Th color="gray.400" isNumeric>
                Video ER
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {[...videos]
              .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
              .map((video) => (
                <Tr key={video.videoId}>
                  <Td>
                    <Text fontWeight="semibold" color="white">
                      {video.title}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(video.publishedAt).toLocaleDateString()}
                    </Text>
                  </Td>
                  <Td isNumeric color="gray.100" fontVariantNumeric="tabular-nums">
                    {numberFormatter.format(Number(video.views) || 0)}
                  </Td>
                  <Td isNumeric color="gray.100" fontVariantNumeric="tabular-nums">
                    {numberFormatter.format(Number(video.likes) || 0)}
                  </Td>
                  <Td isNumeric color="gray.100" fontVariantNumeric="tabular-nums">
                    {numberFormatter.format(Number(video.comments) || 0)}
                  </Td>
                  <Td isNumeric color="gray.100" fontVariantNumeric="tabular-nums">
                    {(Number(video.engagementRate) || 0).toFixed(2)}%
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      ) : (
        <Text color="gray.500" textAlign="center">
          No recent uploads were returned by the YouTube API.
        </Text>
      )}
    </CardBody>
  </Card>
);

VideoTable.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      videoId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      publishedAt: PropTypes.string.isRequired,
      views: PropTypes.number.isRequired,
      likes: PropTypes.number.isRequired,
      comments: PropTypes.number.isRequired,
      engagementRate: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default VideoTable;


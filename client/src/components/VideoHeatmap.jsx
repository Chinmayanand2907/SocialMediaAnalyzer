import PropTypes from 'prop-types';
import { Box, Heading, Text, VStack, SimpleGrid, Tooltip } from '@chakra-ui/react';

const VideoHeatmap = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  // Calculate engagement intensity (0-100 scale)
  const maxEngagement = Math.max(...videos.map(v => v.engagementRate));
  const minEngagement = Math.min(...videos.map(v => v.engagementRate));
  const range = maxEngagement - minEngagement || 1;

  const getColor = (engagement) => {
    const intensity = ((engagement - minEngagement) / range) * 100;
    
    if (intensity >= 80) return { bg: 'green.500', label: 'Excellent' };
    if (intensity >= 60) return { bg: 'blue.500', label: 'Good' };
    if (intensity >= 40) return { bg: 'yellow.500', label: 'Average' };
    if (intensity >= 20) return { bg: 'orange.500', label: 'Below Average' };
    return { bg: 'red.500', label: 'Poor' };
  };

  const getSize = (views) => {
    const maxViews = Math.max(...videos.map(v => v.views));
    const viewRatio = views / maxViews;
    
    if (viewRatio >= 0.8) return { size: '120px', label: 'Very High' };
    if (viewRatio >= 0.6) return { size: '100px', label: 'High' };
    if (viewRatio >= 0.4) return { size: '80px', label: 'Medium' };
    if (viewRatio >= 0.2) return { size: '60px', label: 'Low' };
    return { size: '50px', label: 'Very Low' };
  };

  return (
    <Box bg="gray.800" borderRadius="2xl" p={{ base: 6, md: 8 }} border="1px solid" borderColor="gray.700">
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" color="white" mb={2}>
            Video Performance Heatmap
          </Heading>
          <Text color="gray.400" fontSize="sm">
            Circle size represents views • Color represents engagement rate
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 2, sm: 3, md: 4, lg: 5 }} spacing={6} justifyItems="center">
          {videos.map((video, index) => {
            const colorData = getColor(video.engagementRate);
            const sizeData = getSize(video.views);

            return (
              <Tooltip
                key={video.videoId}
                label={
                  <Box p={2}>
                    <Text fontWeight="bold" mb={1} noOfLines={2}>
                      {video.title}
                    </Text>
                    <Text fontSize="xs">Views: {video.views.toLocaleString()}</Text>
                    <Text fontSize="xs">Engagement: {video.engagementRate}%</Text>
                    <Text fontSize="xs">Likes: {video.likes.toLocaleString()}</Text>
                    <Text fontSize="xs">Comments: {video.comments.toLocaleString()}</Text>
                    <Text fontSize="xs" mt={1}>
                      Performance: {colorData.label} • {sizeData.label} Views
                    </Text>
                  </Box>
                }
                placement="top"
                hasArrow
                bg="gray.900"
                color="white"
                fontSize="sm"
              >
                <VStack spacing={2} cursor="pointer">
                  <Box
                    w={sizeData.size}
                    h={sizeData.size}
                    borderRadius="full"
                    bg={colorData.bg}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    transition="all 0.3s"
                    _hover={{
                      transform: 'scale(1.1)',
                      boxShadow: `0 0 20px ${colorData.bg}`,
                    }}
                    boxShadow="0 4px 15px rgba(0,0,0,0.3)"
                  >
                    <Text color="white" fontWeight="bold" fontSize="xs">
                      {index + 1}
                    </Text>
                  </Box>
                  <Text
                    color="gray.400"
                    fontSize="xs"
                    textAlign="center"
                    noOfLines={1}
                    maxW={sizeData.size}
                  >
                    Video {index + 1}
                  </Text>
                </VStack>
              </Tooltip>
            );
          })}
        </SimpleGrid>

        <Box bg="gray.900" borderRadius="lg" p={4}>
          <Text color="gray.300" fontSize="sm" fontWeight="semibold" mb={3}>
            Legend:
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
            <Box>
              <Text color="gray.400" fontSize="xs" mb={2}>
                Engagement Rate:
              </Text>
              <VStack spacing={1} align="start">
                {[
                  { color: 'green.500', label: 'Excellent (Top 20%)' },
                  { color: 'blue.500', label: 'Good (60-80%)' },
                  { color: 'yellow.500', label: 'Average (40-60%)' },
                  { color: 'orange.500', label: 'Below Avg (20-40%)' },
                  { color: 'red.500', label: 'Poor (Bottom 20%)' },
                ].map((item) => (
                  <Box key={item.label} display="flex" alignItems="center" gap={2}>
                    <Box w="12px" h="12px" borderRadius="full" bg={item.color} />
                    <Text color="gray.300" fontSize="xs">
                      {item.label}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
            <Box>
              <Text color="gray.400" fontSize="xs" mb={2}>
                View Count:
              </Text>
              <VStack spacing={1} align="start">
                {[
                  { size: '16px', label: 'Very High (Top 20%)' },
                  { size: '14px', label: 'High (60-80%)' },
                  { size: '12px', label: 'Medium (40-60%)' },
                  { size: '10px', label: 'Low (20-40%)' },
                  { size: '8px', label: 'Very Low (Bottom 20%)' },
                ].map((item) => (
                  <Box key={item.label} display="flex" alignItems="center" gap={2}>
                    <Box w={item.size} h={item.size} borderRadius="full" bg="gray.600" />
                    <Text color="gray.300" fontSize="xs">
                      {item.label}
                    </Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

VideoHeatmap.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      videoId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      views: PropTypes.number.isRequired,
      likes: PropTypes.number.isRequired,
      comments: PropTypes.number.isRequired,
      engagementRate: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default VideoHeatmap;

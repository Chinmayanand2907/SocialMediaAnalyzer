import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(value);

const VideoCharts = ({ videos }) => {
  const chartBg = useColorModeValue('gray.800', 'gray.800');
  const chartBorder = useColorModeValue('gray.700', 'gray.700');

  const normalizedVideos = videos.map((video) => ({
    ...video,
    views: Number(video.views) || 0,
    likes: Number(video.likes) || 0,
    comments: Number(video.comments) || 0,
  }));

  const viewsData = [...normalizedVideos]
    .sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt))
    .map((video) => ({
      name: video.title.length > 22 ? `${video.title.slice(0, 22)}…` : video.title,
      views: video.views,
    }));

  const hasViewData = viewsData.some((item) => item.views > 0);

  const totalLikes = normalizedVideos.reduce((sum, video) => sum + video.likes, 0);
  const totalComments = normalizedVideos.reduce((sum, video) => sum + video.comments, 0);
  const totalEngagement = totalLikes + totalComments;
  const hasEngagementData = totalEngagement > 0;

  const engagementData = [
    { name: 'Likes', value: totalLikes },
    { name: 'Comments', value: totalComments },
  ];

  const pieColors = ['#63b3ed', '#f6ad55'];

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
      <Card bg={chartBg} border="1px solid" borderColor={chartBorder} borderRadius="2xl">
        <CardHeader>
          <Heading size="md" color="white">
            Views for latest 10 videos
          </Heading>
          <Text color="gray.400" fontSize="sm">
            Ordered by publish date
          </Text>
        </CardHeader>
        <CardBody minH="320px">
          {hasViewData ? (
            <Box w="100%" h="280px" minW="300px">
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={280}>
                <BarChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                  <XAxis dataKey="name" stroke="#cbd5f5" hide />
                  <YAxis stroke="#cbd5f5" tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4a5568' }}
                    formatter={(value) => [formatNumber(value), 'Views']}
                  />
                  <Bar dataKey="views" fill="#3182ce" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Text color="gray.500" textAlign="center" mt={12}>
              View counts are unavailable for the selected channel.
            </Text>
          )}
        </CardBody>
      </Card>

      <Card bg={chartBg} border="1px solid" borderColor={chartBorder} borderRadius="2xl">
        <CardHeader>
          <Heading size="md" color="white">
            Engagement breakdown
          </Heading>
          <Text color="gray.400" fontSize="sm">
            Likes vs. comments
          </Text>
        </CardHeader>
        <CardBody minH="320px">
          {hasEngagementData ? (
            <Box w="100%" h="280px" minW="300px">
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={280}>
                <PieChart>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4a5568' }}
                    formatter={(value, name) => [formatNumber(value), name]}
                  />
                  <Pie
                    data={engagementData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) =>
                      `${entry.name}: ${((entry.value / (totalEngagement || 1)) * 100).toFixed(1)}%`
                    }
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={pieColors[index]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Text color="gray.500" textAlign="center" mt={12}>
              Likes and comments are hidden for these videos.
            </Text>
          )}
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

VideoCharts.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      videoId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      publishedAt: PropTypes.string.isRequired,
      views: PropTypes.number.isRequired,
      likes: PropTypes.number.isRequired,
      comments: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default VideoCharts;


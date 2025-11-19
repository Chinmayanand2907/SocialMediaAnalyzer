const Analysis = require('../models/Analysis');

const { youtube } = require('@googleapis/youtube');

const youtubeClient = youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

const safeNumber = (value) => Number(value) || 0;

const calculateEngagementRate = ({ likes, comments, views }) => {
  if (!views) return 0;
  return Number((((likes + comments) / views) * 100).toFixed(2));
};

const fetchChannelDetails = async (channelId) => {
  const response = await youtubeClient.channels.list({
    id: channelId,
    part: ['snippet', 'statistics'],
  });

  if (!response.data.items || response.data.items.length === 0) {
    throw new Error('Channel not found');
  }

  const channel = response.data.items[0];

  return {
    title: channel.snippet.title,
    subscribers: safeNumber(channel.statistics.subscriberCount),
  };
};

const fetchLatestVideoIds = async (channelId) => {
  const response = await youtubeClient.search.list({
    channelId,
    part: ['id'],
    type: ['video'],
    order: 'date',
    maxResults: 10,
  });

  const items = response.data.items || [];
  return items
    .map((item) => item.id?.videoId)
    .filter(Boolean);
};

const fetchVideoStats = async (videoIds) => {
  if (!videoIds.length) return [];

  const response = await youtubeClient.videos.list({
    id: videoIds,
    part: ['snippet', 'statistics'],
  });

  const items = response.data.items || [];

  return items.map((video) => {
    const stats = video.statistics || {};
    const snippet = video.snippet || {};

    const views = safeNumber(stats.viewCount);
    const likes = safeNumber(stats.likeCount);
    const comments = safeNumber(stats.commentCount);

    return {
      videoId: video.id,
      title: snippet.title || 'Untitled Video',
      publishedAt: snippet.publishedAt || new Date().toISOString(),
      views,
      likes,
      comments,
      engagementRate: calculateEngagementRate({ likes, comments, views }),
    };
  });
};

const analyzeChannel = async (req, res, next) => {
  try {
    const { channelId } = req.body;

    if (!channelId) {
      return res.status(400).json({ message: 'channelId is required' });
    }

    // Normalize channelId - remove UC prefix if user included it
    const normalizedChannelId = channelId.startsWith('UC') ? channelId : `UC${channelId}`;

    const channelDetails = await fetchChannelDetails(normalizedChannelId);
    const videoIds = await fetchLatestVideoIds(normalizedChannelId);
    const videos = await fetchVideoStats(videoIds);

    if (!videos.length) {
      return res.status(404).json({ message: 'No videos found for this channel' });
    }

    const channelEngagementRate =
      videos.reduce((sum, video) => sum + video.engagementRate, 0) / videos.length;

    const report = await Analysis.create({
      channelId: normalizedChannelId,
      channelTitle: channelDetails.title,
      totalSubscribers: channelDetails.subscribers,
      channelEngagementRate: Number(channelEngagementRate.toFixed(2)),
      videos,
    });

    return res.status(200).json(report);
  } catch (error) {
    // Log error for debugging
    console.error('Error analyzing channel:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      reason: error.response?.data?.error?.errors?.[0]?.reason,
      channelId: req.body?.channelId,
    });

    // Handle database errors
    if (error.errors) {
      return res.status(500).json({ message: 'Database error', details: error.message });
    }

    // Handle YouTube API errors
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data?.error || {};
      const reason = errorData.errors?.[0]?.reason || '';
      const message = errorData.message || error.message || 'YouTube API error';

      // Map common YouTube API errors to user-friendly messages
      let userMessage = message;
      if (reason === 'quotaExceeded') {
        userMessage = 'YouTube API quota exceeded. Please try again later.';
      } else if (reason === 'keyInvalid') {
        userMessage = 'Invalid YouTube API key. Please contact support.';
      } else if (reason === 'channelNotFound' || message.includes('not found')) {
        userMessage = 'Channel not found. Please check the Channel ID.';
      } else if (status === 403) {
        userMessage = 'Access denied. The channel may be private or the API key lacks permissions.';
      } else if (status === 400) {
        userMessage = 'Invalid request. Please check the Channel ID format.';
      }

      return res.status(status || 500).json({ message: userMessage });
    }

    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return res.status(503).json({ message: 'Unable to connect to YouTube API. Please try again later.' });
    }

    // Handle other errors
    const errorMessage = error.message || 'Failed to analyze channel';
    return res.status(500).json({ message: errorMessage });
  }
};

const getHistory = async (req, res, next) => {
  try {
    const history = await Analysis.find().sort({ createdAt: -1 }).limit(20);
    return res.status(200).json(history);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  analyzeChannel,
  getHistory,
};


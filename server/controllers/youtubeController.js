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

    const channelDetails = await fetchChannelDetails(channelId);
    const videoIds = await fetchLatestVideoIds(channelId);
    const videos = await fetchVideoStats(videoIds);

    if (!videos.length) {
      return res.status(404).json({ message: 'No videos found for this channel' });
    }

    const channelEngagementRate =
      videos.reduce((sum, video) => sum + video.engagementRate, 0) / videos.length;

    const report = await Analysis.create({
      channelId,
      channelTitle: channelDetails.title,
      totalSubscribers: channelDetails.subscribers,
      channelEngagementRate: Number(channelEngagementRate.toFixed(2)),
      videos,
    });

    return res.status(200).json(report);
  } catch (error) {
    if (error.errors) {
      return res.status(500).json({ message: 'Database error', details: error.message });
    }
    return next(error);
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


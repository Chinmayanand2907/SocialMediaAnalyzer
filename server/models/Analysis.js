const mongoose = require('mongoose');

const videoStatsSchema = new mongoose.Schema(
  {
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    publishedAt: { type: Date, required: true },
    views: { type: Number, required: true },
    likes: { type: Number, required: true },
    comments: { type: Number, required: true },
    engagementRate: { type: Number, required: true },
  },
  { _id: false }
);

const analysisSchema = new mongoose.Schema(
  {
    channelId: { type: String, required: true },
    channelTitle: { type: String, required: true },
    totalSubscribers: { type: Number, required: true },
    channelEngagementRate: { type: Number, required: true },
    videos: {
      type: [videoStatsSchema],
      default: [],
    },
    // Optional user association
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    // Track if analysis is public or private
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analysis', analysisSchema);


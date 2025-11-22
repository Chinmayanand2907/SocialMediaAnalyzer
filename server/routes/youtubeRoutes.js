const express = require('express');
const { analyzeChannel, getHistory } = require('../controllers/youtubeController');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Apply optional authentication to all routes
router.use(optionalAuth);

router.post('/analyze/channel', analyzeChannel);
router.get('/history', getHistory);

module.exports = router;


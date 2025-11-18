const express = require('express');
const { analyzeChannel, getHistory } = require('../controllers/youtubeController');

const router = express.Router();

router.post('/analyze/channel', analyzeChannel);
router.get('/history', getHistory);

module.exports = router;


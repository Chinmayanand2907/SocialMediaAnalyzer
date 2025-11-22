import PropTypes from 'prop-types';
import { useEffect } from 'react';

const PresentationView = ({ report }) => {
  useEffect(() => {
    if (!report) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${report.channelTitle} - Presentation</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            overflow: hidden;
          }
          .slide {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 60px;
            page-break-after: always;
          }
          .slide-1 {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .slide-2 {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }
          .slide-3 {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }
          .slide-4 {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          }
          h1 {
            font-size: 72px;
            margin-bottom: 30px;
            text-align: center;
            text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
            animation: fadeInDown 1s;
          }
          h2 {
            font-size: 48px;
            margin-bottom: 40px;
            text-align: center;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
          }
          .subtitle {
            font-size: 28px;
            opacity: 0.9;
            text-align: center;
            max-width: 800px;
          }
          .kpi-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 40px;
            margin-top: 50px;
            width: 100%;
            max-width: 1200px;
          }
          .kpi-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            animation: fadeInUp 1s;
          }
          .kpi-label {
            font-size: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
            opacity: 0.8;
          }
          .kpi-value {
            font-size: 56px;
            font-weight: bold;
          }
          .chart-container {
            width: 100%;
            max-width: 1200px;
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            margin-top: 40px;
          }
          .bar-chart {
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            height: 400px;
            gap: 20px;
          }
          .bar {
            flex: 1;
            background: linear-gradient(to top, rgba(255,255,255,0.3), rgba(255,255,255,0.8));
            border-radius: 10px 10px 0 0;
            position: relative;
            transition: all 0.3s;
            animation: growUp 1.5s;
          }
          .bar-label {
            position: absolute;
            bottom: -35px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 14px;
            white-space: nowrap;
          }
          .bar-value {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-weight: bold;
            font-size: 16px;
          }
          .video-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 30px;
            width: 100%;
            max-width: 1200px;
            margin-top: 40px;
          }
          .video-card {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            padding: 30px;
            border-radius: 15px;
            animation: fadeIn 1s;
          }
          .video-title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .video-stats {
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            opacity: 0.9;
          }
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(50px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes growUp {
            from { transform: scaleY(0); }
            to { transform: scaleY(1); }
          }
          @media print {
            .slide { page-break-after: always; }
          }
        </style>
      </head>
      <body>
        <!-- Slide 1: Title -->
        <div class="slide slide-1">
          <h1>📊 YouTube Channel Analysis</h1>
          <p class="subtitle">${report.channelTitle}</p>
          <p class="subtitle" style="font-size: 20px; margin-top: 20px; opacity: 0.7;">
            Generated on ${new Date().toLocaleDateString()}
          </p>
        </div>

        <!-- Slide 2: Key Metrics -->
        <div class="slide slide-2">
          <h2>Key Performance Indicators</h2>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Total Subscribers</div>
              <div class="kpi-value">${formatNumber(report.totalSubscribers)}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Avg Engagement</div>
              <div class="kpi-value">${report.channelEngagementRate}%</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Videos Analyzed</div>
              <div class="kpi-value">${report.videos.length}</div>
            </div>
          </div>
          <div class="kpi-grid" style="grid-template-columns: repeat(2, 1fr);">
            <div class="kpi-card">
              <div class="kpi-label">Total Views</div>
              <div class="kpi-value">${formatNumber(report.videos.reduce((sum, v) => sum + v.views, 0))}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">Total Engagement</div>
              <div class="kpi-value">${formatNumber(report.videos.reduce((sum, v) => sum + v.likes + v.comments, 0))}</div>
            </div>
          </div>
        </div>

        <!-- Slide 3: Video Performance Chart -->
        <div class="slide slide-3">
          <h2>Video Performance Overview</h2>
          <div class="chart-container">
            <div class="bar-chart">
              ${report.videos.slice(0, 8).map((video, i) => {
                const maxViews = Math.max(...report.videos.map(v => v.views));
                const height = (video.views / maxViews) * 100;
                return `
                  <div class="bar" style="height: ${height}%;">
                    <div class="bar-value">${formatNumber(video.views)}</div>
                    <div class="bar-label">Video ${i + 1}</div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>

        <!-- Slide 4: Top Videos -->
        <div class="slide slide-4">
          <h2>Top Performing Videos</h2>
          <div class="video-grid">
            ${report.videos.slice(0, 4).map((video) => `
              <div class="video-card">
                <div class="video-title">🎥 ${video.title.replace(/[<>"'&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '&': '&amp;' }[c]))}</div>
                <div class="video-stats">
                  <span>👁️ ${formatNumber(video.views)}</span>
                  <span>👍 ${formatNumber(video.likes)}</span>
                  <span>💬 ${formatNumber(video.comments)}</span>
                </div>
                <div class="video-stats" style="margin-top: 10px;">
                  <span>Engagement: ${video.engagementRate}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <script>
          function formatNumber(num) {
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
            return num.toLocaleString();
          }

          function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
          }
        </script>
      </body>
      </html>
    `;

    // Open print window safely
    try {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('Failed to open presentation window:', error);
    }
  }, [report]);

  return null;
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

PresentationView.propTypes = {
  report: PropTypes.shape({
    channelTitle: PropTypes.string.isRequired,
    totalSubscribers: PropTypes.number.isRequired,
    channelEngagementRate: PropTypes.number.isRequired,
    videos: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        views: PropTypes.number.isRequired,
        likes: PropTypes.number.isRequired,
        comments: PropTypes.number.isRequired,
        engagementRate: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default PresentationView;

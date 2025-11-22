/**
 * Export report data to CSV format
 */
export const exportToCSV = (report) => {
  if (!report || !report.videos) {
    throw new Error('No report data to export');
  }

  const { channelTitle, totalSubscribers, channelEngagementRate, videos } = report;

  // Create CSV header
  let csv = 'YouTube Channel Engagement Report\n\n';
  csv += 'Channel Information\n';
  csv += `Channel Name,${escapeCsvValue(channelTitle)}\n`;
  csv += `Total Subscribers,${totalSubscribers.toLocaleString()}\n`;
  csv += `Average Engagement Rate,${channelEngagementRate}%\n`;
  csv += `Report Generated,${new Date().toLocaleString()}\n\n`;

  // Video details header
  csv += 'Video Performance Details\n';
  csv += 'Title,Published Date,Views,Likes,Comments,Engagement Rate\n';

  // Add video rows
  videos.forEach((video) => {
    const publishDate = new Date(video.publishedAt).toLocaleDateString();
    csv += `${escapeCsvValue(video.title)},`;
    csv += `${publishDate},`;
    csv += `${video.views.toLocaleString()},`;
    csv += `${video.likes.toLocaleString()},`;
    csv += `${video.comments.toLocaleString()},`;
    csv += `${video.engagementRate}%\n`;
  });

  // Calculate summary statistics
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const totalLikes = videos.reduce((sum, v) => sum + v.likes, 0);
  const totalComments = videos.reduce((sum, v) => sum + v.comments, 0);

  csv += '\nSummary Statistics\n';
  csv += `Total Videos Analyzed,${videos.length}\n`;
  csv += `Total Views,${totalViews.toLocaleString()}\n`;
  csv += `Total Likes,${totalLikes.toLocaleString()}\n`;
  csv += `Total Comments,${totalComments.toLocaleString()}\n`;
  csv += `Average Views per Video,${Math.round(totalViews / videos.length).toLocaleString()}\n`;

  // Download the CSV file
  downloadFile(csv, `${sanitizeFilename(channelTitle)}_report_${Date.now()}.csv`, 'text/csv');
};

/**
 * Export report data to PDF format (using basic HTML and print)
 */
export const exportToPDF = (report) => {
  if (!report || !report.videos) {
    throw new Error('No report data to export');
  }

  const { channelTitle, totalSubscribers, channelEngagementRate, videos } = report;

  // Create HTML content for PDF
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${channelTitle} - Engagement Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          padding: 40px;
          line-height: 1.6;
          color: #1a202c;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #3182ce;
        }
        h1 { 
          font-size: 28px;
          color: #2d3748;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 14px;
          color: #718096;
        }
        .kpi-section {
          display: flex;
          justify-content: space-around;
          margin: 30px 0;
          padding: 20px;
          background: #f7fafc;
          border-radius: 8px;
        }
        .kpi-card {
          text-align: center;
        }
        .kpi-label {
          font-size: 12px;
          text-transform: uppercase;
          color: #718096;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .kpi-value {
          font-size: 24px;
          font-weight: bold;
          color: #2d3748;
        }
        .section-title {
          font-size: 20px;
          color: #2d3748;
          margin: 30px 0 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 13px;
        }
        th {
          background: #2d3748;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
        }
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        tr:hover {
          background: #f7fafc;
        }
        .video-title {
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .summary {
          margin-top: 30px;
          padding: 20px;
          background: #ebf8ff;
          border-left: 4px solid #3182ce;
          border-radius: 4px;
        }
        .summary-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #2c5282;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 12px;
          color: #718096;
        }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>YouTube Channel Engagement Report</h1>
        <div class="subtitle">Generated on ${new Date().toLocaleString()}</div>
      </div>

      <div class="kpi-section">
        <div class="kpi-card">
          <div class="kpi-label">Channel Name</div>
          <div class="kpi-value">${escapeHtml(channelTitle)}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Total Subscribers</div>
          <div class="kpi-value">${totalSubscribers.toLocaleString()}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Avg. Engagement Rate</div>
          <div class="kpi-value">${channelEngagementRate}%</div>
        </div>
      </div>

      <h2 class="section-title">Video Performance Details</h2>
      <table>
        <thead>
          <tr>
            <th>Video Title</th>
            <th>Published</th>
            <th style="text-align: right;">Views</th>
            <th style="text-align: right;">Likes</th>
            <th style="text-align: right;">Comments</th>
            <th style="text-align: right;">Engagement</th>
          </tr>
        </thead>
        <tbody>
          ${videos
            .map(
              (video) => `
            <tr>
              <td class="video-title">${escapeHtml(video.title)}</td>
              <td>${new Date(video.publishedAt).toLocaleDateString()}</td>
              <td style="text-align: right;">${video.views.toLocaleString()}</td>
              <td style="text-align: right;">${video.likes.toLocaleString()}</td>
              <td style="text-align: right;">${video.comments.toLocaleString()}</td>
              <td style="text-align: right;">${video.engagementRate}%</td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>

      <div class="summary">
        <div class="summary-title">Summary Statistics</div>
        <div>Total Videos Analyzed: <strong>${videos.length}</strong></div>
        <div>Total Views: <strong>${videos.reduce((sum, v) => sum + v.views, 0).toLocaleString()}</strong></div>
        <div>Total Likes: <strong>${videos.reduce((sum, v) => sum + v.likes, 0).toLocaleString()}</strong></div>
        <div>Total Comments: <strong>${videos.reduce((sum, v) => sum + v.comments, 0).toLocaleString()}</strong></div>
        <div>Average Views per Video: <strong>${Math.round(videos.reduce((sum, v) => sum + v.views, 0) / videos.length).toLocaleString()}</strong></div>
      </div>

      <div class="footer">
        YouTube Engagement Analyzer © 2025 | Built with React & Node.js
      </div>
    </body>
    </html>
  `;

  // Open print window
  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print();
  };
};

/**
 * Helper function to escape CSV values
 */
const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

/**
 * Helper function to escape HTML
 */
const escapeHtml = (text) => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Helper function to sanitize filename
 */
const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

/**
 * Helper function to download file
 */
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

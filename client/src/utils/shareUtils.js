/**
 * Generate a shareable link for a report
 * Encodes report data in URL-safe base64 format
 */
export const generateShareableLink = (report) => {
  if (!report) {
    throw new Error('No report data to share');
  }

  // Create a compact version of the report
  const shareData = {
    cId: report.channelId,
    cTitle: report.channelTitle,
    subs: report.totalSubscribers,
    eng: report.channelEngagementRate,
    videos: report.videos.map(v => ({
      id: v.videoId,
      t: v.title,
      p: v.publishedAt,
      v: v.views,
      l: v.likes,
      c: v.comments,
      e: v.engagementRate,
    })),
    ts: Date.now(),
  };

  // Convert to JSON and then to base64
  const jsonStr = JSON.stringify(shareData);
  const base64 = btoa(encodeURIComponent(jsonStr));
  
  // Generate the shareable URL
  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = `${baseUrl}?share=${base64}`;
  
  return shareUrl;
};

/**
 * Parse a shareable link and extract report data
 */
export const parseShareableLink = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const shareParam = urlParams.get('share');
  
  if (!shareParam) {
    return null;
  }

  try {
    // Decode base64 and parse JSON
    const jsonStr = decodeURIComponent(atob(shareParam));
    const shareData = JSON.parse(jsonStr);
    
    // Convert back to full report format
    const report = {
      channelId: shareData.cId,
      channelTitle: shareData.cTitle,
      totalSubscribers: shareData.subs,
      channelEngagementRate: shareData.eng,
      videos: shareData.videos.map(v => ({
        videoId: v.id,
        title: v.t,
        publishedAt: v.p,
        views: v.v,
        likes: v.l,
        comments: v.c,
        engagementRate: v.e,
      })),
      sharedAt: shareData.ts,
    };
    
    return report;
  } catch (error) {
    console.error('Failed to parse shared link:', error);
    return null;
  }
};

/**
 * Copy shareable link to clipboard
 */
export const copyShareableLink = async (report) => {
  const shareUrl = generateShareableLink(report);
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      return { success: true, url: shareUrl };
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return { success: true, url: shareUrl };
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw new Error('Failed to copy link to clipboard');
  }
};

/**
 * Share via Web Share API (mobile-friendly)
 */
export const shareViaWebAPI = async (report) => {
  if (!navigator.share) {
    throw new Error('Web Share API not supported');
  }

  const shareUrl = generateShareableLink(report);
  
  try {
    await navigator.share({
      title: `${report.channelTitle} - YouTube Analytics`,
      text: `Check out the engagement analysis for ${report.channelTitle}: ${report.channelEngagementRate}% avg engagement rate`,
      url: shareUrl,
    });
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      // User cancelled the share
      return { success: false, cancelled: true };
    }
    throw error;
  }
};

/**
 * Generate QR code data URL for sharing
 */
export const generateQRCode = async (report) => {
  const shareUrl = generateShareableLink(report);
  
  // Simple QR code generation using a free API
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;
  
  return qrApiUrl;
};

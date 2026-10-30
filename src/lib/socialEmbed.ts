/**
 * Helper utilities for parsing social media reel/video links
 * and generating embeddable iframe URLs.
 */

export interface SocialEmbedInfo {
  type: "iframe" | "video" | "external";
  embedUrl: string | null;
  platform: "instagram" | "youtube" | "tiktok" | "facebook" | "direct" | "other";
  rawUrl: string;
}

/**
 * Extracts platform and generates an iframe embed URL for popular video/reel platforms.
 */
export function getSocialEmbedInfo(
  url: string | undefined,
  options: { autoplay?: boolean } = {}
): SocialEmbedInfo {
  if (!url || !url.trim()) {
    return { type: "external", embedUrl: null, platform: "other", rawUrl: "" };
  }

  const cleanUrl = url.trim();

  // 1. Direct video URL (Cloudinary video, mp4, webm)
  if (
    cleanUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ||
    cleanUrl.includes("video/upload/")
  ) {
    return {
      type: "video",
      embedUrl: cleanUrl,
      platform: "direct",
      rawUrl: cleanUrl,
    };
  }

  // 2. Instagram Reel or Post
  // e.g. https://www.instagram.com/reel/C-XYZ123/ or https://www.instagram.com/username/reel/C-XYZ123/ or /p/C-XYZ123/
  const igMatch = cleanUrl.match(
    /instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i
  );
  if (igMatch && igMatch[1]) {
    const postId = igMatch[1];
    return {
      type: "iframe",
      embedUrl: `https://www.instagram.com/reel/${postId}/embed/`,
      platform: "instagram",
      rawUrl: cleanUrl,
    };
  }

  // 3. YouTube Shorts or standard video
  let ytId: string | null = null;
  const ytShortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i);
  const ytWatchMatch = cleanUrl.match(/[?&]v=([a-zA-Z0-9_-]{11})/i);
  const ytShortMatch = cleanUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/i);

  if (ytShortsMatch) ytId = ytShortsMatch[1];
  else if (ytWatchMatch) ytId = ytWatchMatch[1];
  else if (ytShortMatch) ytId = ytShortMatch[1];

  if (ytId) {
    const ap = options.autoplay ? "autoplay=1&mute=1&" : "";
    return {
      type: "iframe",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytId}?${ap}playsinline=1&modestbranding=1&rel=0`,
      platform: "youtube",
      rawUrl: cleanUrl,
    };
  }

  // 4. TikTok Video
  // e.g. https://www.tiktok.com/@user/video/7123456789012345678
  const ttMatch = cleanUrl.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/i);
  if (ttMatch && ttMatch[1]) {
    const videoId = ttMatch[1];
    return {
      type: "iframe",
      embedUrl: `https://www.tiktok.com/player/v1/${videoId}?autoplay=1`,
      platform: "tiktok",
      rawUrl: cleanUrl,
    };
  }

  // 5. Facebook Reel or Video
  if (
    cleanUrl.includes("facebook.com") ||
    cleanUrl.includes("fb.watch") ||
    cleanUrl.includes("fb.me")
  ) {
    return {
      type: "iframe",
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
        cleanUrl
      )}&show_text=0&autoplay=1`,
      platform: "facebook",
      rawUrl: cleanUrl,
    };
  }

  return {
    type: "external",
    embedUrl: null,
    platform: "other",
    rawUrl: cleanUrl,
  };
}

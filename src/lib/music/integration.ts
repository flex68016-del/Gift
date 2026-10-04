/**
 * Intégrations musicales sécurisées
 * Extrait l'identifiant et reconstruit l'URL d'intégration
 */

const YOUTUBE_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
const SPOTIFY_REGEX = /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/track\/([a-zA-Z0-9]+)/;

export interface MusicIntegration {
  provider: "youtube" | "spotify";
  id: string;
  embedUrl: string;
}

export function parseMusicUrl(url: string): MusicIntegration | null {
  // YouTube
  const youtubeMatch = url.match(YOUTUBE_REGEX);
  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return {
      provider: "youtube",
      id: videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    };
  }

  // Spotify
  const spotifyMatch = url.match(SPOTIFY_REGEX);
  if (spotifyMatch && spotifyMatch[1]) {
    const trackId = spotifyMatch[1];
    return {
      provider: "spotify",
      id: trackId,
      embedUrl: `https://open.spotify.com/embed/track/${trackId}`,
    };
  }

  return null;
}

export function isValidMusicUrl(url: string): boolean {
  return parseMusicUrl(url) !== null;
}

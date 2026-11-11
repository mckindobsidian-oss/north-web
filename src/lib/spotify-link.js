export const DEFAULT_SPOTIFY_PLAYLIST = 'https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6';

/** Accept Spotify share links consistently on web, desktop and native mobile. */
export function spotifyLink(value) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.hostname !== 'open.spotify.com' || url.username || url.password || url.port) return null;
    const match = /^\/(?:intl-[a-z-]+\/)?(playlist|album|track|artist|show|episode)\/([A-Za-z0-9]+)\/?$/.exec(url.pathname);
    if (!match) return null;
    const [,type,id] = match;
    return {type,id,url:`https://open.spotify.com/${type}/${id}`,embed:`https://open.spotify.com/embed/${type}/${id}`};
  } catch { return null; }
}

/**
 * Calculates the distance between two points in meters using the Haversine formula.
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function playSound(url: string, volume: number = 0.5, fallbackUrl?: string, loop: boolean = false) {
  const audio = new Audio();
  audio.volume = volume;
  audio.loop = loop;

  const play = (src: string, isFallback: boolean = false) => {
    audio.src = src;
    audio.play().catch(err => {
      // Ignore errors from user interaction requirements
      if (err.name === 'NotAllowedError' || err.name === 'AbortError') return;
      
      console.warn(`${isFallback ? 'Fallback' : 'Primary'} audio failed:`, src);
      
      if (!isFallback && fallbackUrl) {
        play(fallbackUrl, true);
      }
    });
  };

  play(url);
  return audio;
}

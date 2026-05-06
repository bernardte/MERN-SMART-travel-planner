const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY as string;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop";

export interface PexelsPhoto {
  id: number;
  src: {
    medium: string;
    small: string;
  };
  alt: string;
}

export async function fetchLocationImage(query: string): Promise<string> {
  if (!query.trim()) return FALLBACK_IMAGE;

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + " travel destination")}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!res.ok) return FALLBACK_IMAGE;

    const data = await res.json();

    if (!data.photos || data.photos.length === 0) return FALLBACK_IMAGE;

    return data.photos[0].src.medium;
  } catch {
    return FALLBACK_IMAGE;
  }
}
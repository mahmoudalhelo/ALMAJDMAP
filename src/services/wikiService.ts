import axios from 'axios';

export interface WikiData {
  title: string;
  extract: string;
  images: string[];
}

export async function fetchWikiData(url: string): Promise<WikiData> {
  try {
    // We use a proxy or direct fetch if CORS allows, but in this environment 
    // we might need to handle it server-side if it was a full-stack app.
    // However, for this React app, we'll try to use the Wikipedia API which is CORS-friendly.
    
    let title = url.split('/wiki/')[1];
    if (!title) throw new Error('Invalid Wikipedia URL');
    
    // Remove fragments and query params
    title = title.split('#')[0].split('?')[0];
    
    // Normalize encoding: decode first then encode properly
    const normalizedTitle = encodeURIComponent(decodeURIComponent(title));
    
    const apiUrl = `https://ar.wikipedia.org/api/rest_v1/page/summary/${normalizedTitle}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'AlmajdMap/1.0 (mhmoudalhelo@gmail.com)'
      }
    });
    const data = response.data;

    let images: string[] = [];
    try {
      // Get more images using the media API
      const mediaUrl = `https://ar.wikipedia.org/api/rest_v1/page/media-list/${normalizedTitle}`;
      const mediaResponse = await axios.get(mediaUrl, {
        headers: {
          'User-Agent': 'AlmajdMap/1.0 (mhmoudalhelo@gmail.com)'
        }
      });
      images = mediaResponse.data.items
        .filter((item: any) => item.type === 'image')
        .map((item: any) => item.srcset?.[0]?.src || item.original?.source)
        .filter(Boolean)
        .map((src: string) => src.startsWith('//') ? `https:${src}` : src);
    } catch (mediaError) {
      console.warn('Failed to fetch media list:', mediaError);
    }

    return {
      title: data.title,
      extract: data.extract,
      images: images.length > 0 ? images : [data.thumbnail?.source].filter(Boolean)
    };
  } catch (error) {
    console.error('Error fetching wiki data:', error);
    throw error;
  }
}

/**
 * MotorOctane Mobile App - API Service
 */

const BASE_URL = 'http://192.168.1.10:5001';

export interface Brand { id: string; name: string; logo?: string; slug: string; }
export interface Model { id: string; name: string; brandId: string; heroImage: string; lowestPrice: number; fuelTypes: string[]; transmissions: string[]; seating: number; isNew: boolean; isPopular: boolean; launchDate?: string; }
export interface UpcomingCar { id: string; name: string; brandId: string; brandName: string; image: string; expectedPriceMin: number; expectedPriceMax: number; fuelTypes: string[]; expectedLaunchDate: string; isNew: boolean; isPopular: boolean; }
export interface YouTubeVideo { id: string; title: string; thumbnail: string; duration: string; views: string; likes: string; publishedAt: string; channelName: string; }

export const api = {
  getBrands: async (): Promise<Brand[]> => {
    try { const r = await fetch(`${BASE_URL}/api/brands`); const d = await r.json(); return Array.isArray(d) ? d : []; }
    catch (e) { console.error('Error brands:', e); return []; }
  },
  getModelsWithPricing: async (limit = 100): Promise<Model[]> => {
    try { const r = await fetch(`${BASE_URL}/api/models-with-pricing?limit=${limit}`); const d = await r.json(); const m = d.data || d || []; return Array.isArray(m) ? m : []; }
    catch (e) { console.error('Error models:', e); return []; }
  },
  getUpcomingCars: async (): Promise<UpcomingCar[]> => {
    try { const r = await fetch(`${BASE_URL}/api/upcoming-cars`); const d = await r.json(); return Array.isArray(d) ? d : []; }
    catch (e) { console.error('Error upcoming:', e); return []; }
  },
  getPopularComparisons: async (): Promise<any[]> => {
    try { const r = await fetch(`${BASE_URL}/api/popular-comparisons`); const d = await r.json(); return Array.isArray(d) ? d : []; }
    catch (e) { console.error('Error comparisons:', e); return []; }
  },
  getNews: async (limit = 6): Promise<any[]> => {
    try { const r = await fetch(`${BASE_URL}/api/news?limit=${limit}`); const d = await r.json(); return d.articles || []; }
    catch (e) { console.error('Error news:', e); return []; }
  },
  getYouTubeVideos: async (): Promise<{ featuredVideo: YouTubeVideo | null; relatedVideos: YouTubeVideo[] }> => {
    try { 
      const r = await fetch(`${BASE_URL}/api/youtube/videos`); 
      const d = await r.json(); 
      return { featuredVideo: d.featuredVideo || null, relatedVideos: d.relatedVideos || [] }; 
    }
    catch (e) { console.error('Error youtube:', e); return { featuredVideo: null, relatedVideos: [] }; }
  },
  search: async (query: string): Promise<any> => {
    try { const r = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`); return r.json(); }
    catch (e) { console.error('Error search:', e); return []; }
  },
};

export default api;

export type FeedbackStatus = 'public' | 'hold';

export interface FeaturedContentItem {
  id: number;
  title: string;
  thumb: string;
  duration: string;
  video?: string;
  visible?: boolean;
}

export interface PortfolioContentItem {
  id: number;
  title: string;
  eventType: 'Wedding' | 'Artist' | 'Corporate & Events' | 'Food & Beverages' | 'Short Films' | 'Fashion';
  mediaType: 'photo' | 'video';
  thumb: string;
  description: string;
  duration?: string;
  videoUrl?: string;
  instagramUrl: string;
  youtubeUrl: string;
  visible?: boolean;
}

export interface SiteContentData {
  featured: FeaturedContentItem[];
  portfolio: PortfolioContentItem[];
}


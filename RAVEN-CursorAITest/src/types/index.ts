export interface Listing {
  id: string;
  title: string;
  price: string;
  imageUrl?: string;
  platform: 'all' | 'ebay' | 'craigslist';
  url?: string;
  description?: string;
}

export interface Stats {
  listingsFound: number;
  averagePrice: string;
}

export type PlatformFilter = 'all' | 'ebay' | 'craigslist';

export type Page = 'home' | 'ebay' | 'craigslist' | 'listing-detail';


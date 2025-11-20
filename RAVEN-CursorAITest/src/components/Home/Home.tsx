import React, { useState } from 'react';
import { PlatformFilter, Listing, Stats } from '@/types';
import { Navigation } from '../Navigation/Navigation';
import { Stats as StatsComponent } from '../Stats/Stats';
import { ListingCard } from '../ListingCard/ListingCard';
import styles from './Home.module.css';

// Mock data - replace with real API calls
const mockStats: Stats = {
  listingsFound: 128,
  averagePrice: '$140.42'
};

const mockListings: Listing[] = [
  {
    id: '1',
    title: 'Nike SB Dunk Low \'Matcha\'',
    price: '$125.00',
    platform: 'all',
    imageUrl: 'https://via.placeholder.com/96x52/7216C7/FFFFFF?text=Nike+SB'
  },
  {
    id: '2',
    title: 'Nike SB Matcha',
    price: '$159.00',
    platform: 'all',
    imageUrl: 'https://via.placeholder.com/96x52/FFF071/000000?text=Matcha'
  },
  {
    id: '3',
    title: 'Nike SB Dunks',
    price: '$139.00',
    platform: 'all',
    imageUrl: 'https://via.placeholder.com/96x52/383838/FFFFFF?text=Dunks'
  }
];

interface HomeProps {
  onNavigate: (page: string, listingId?: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState<PlatformFilter>('all');

  const filteredListings = activeFilter === 'all'
    ? mockListings
    : mockListings.filter(listing => listing.platform === activeFilter);

  const handleFilterChange = (filter: PlatformFilter) => {
    setActiveFilter(filter);
    if (filter === 'ebay') {
      onNavigate('ebay');
    } else if (filter === 'craigslist') {
      onNavigate('craigslist');
    }
  };

  const handleClose = () => {
    // In Chrome extension, this would close the popup
    window.close();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoText}>RAVEN</span>
        </div>
        <button className={styles.closeButton} onClick={handleClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.navigationWrapper}>
        <Navigation activeFilter={activeFilter} onFilterChange={handleFilterChange} />
      </div>

      <StatsComponent stats={mockStats} />

      <div className={styles.filterSection}>
        <p className={styles.filterLabel}>Top Listings</p>
        <button className={styles.viewAllButton}>View All Listings</button>
      </div>

      <div className={styles.listings}>
        {filteredListings.map((listing) => (
          <ListingCard 
            key={listing.id} 
            listing={listing}
            onClick={() => onNavigate('listing-detail', listing.id)}
          />
        ))}
      </div>
    </div>
  );
};


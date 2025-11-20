import React from 'react';
import { Listing, Stats } from '@/types';
import { Navigation } from '../Navigation/Navigation';
import { Stats as StatsComponent } from '../Stats/Stats';
import { ListingCard } from '../ListingCard/ListingCard';
import styles from './Craigslist.module.css';

// Mock data for Craigslist listings
const mockStats: Stats = {
  listingsFound: 43,
  averagePrice: '$132.50'
};

const mockCraigslistListings: Listing[] = [
  {
    id: 'cl-1',
    title: 'Nike SB Dunk Low \'Matcha\'',
    price: '$120.00',
    platform: 'craigslist',
    imageUrl: 'https://via.placeholder.com/96x52/7216C7/FFFFFF?text=Nike+SB'
  },
  {
    id: 'cl-2',
    title: 'Nike SB Matcha',
    price: '$145.00',
    platform: 'craigslist',
    imageUrl: 'https://via.placeholder.com/96x52/FFF071/000000?text=Matcha'
  },
  {
    id: 'cl-3',
    title: 'Nike SB Dunks',
    price: '$135.00',
    platform: 'craigslist',
    imageUrl: 'https://via.placeholder.com/96x52/383838/FFFFFF?text=Dunks'
  },
  {
    id: 'cl-4',
    title: 'Nike SB Dunk High',
    price: '$150.00',
    platform: 'craigslist',
    imageUrl: 'https://via.placeholder.com/96x52/7216C7/FFFFFF?text=High'
  }
];

interface CraigslistProps {
  onNavigate: (page: string, listingId?: string) => void;
}

export const Craigslist: React.FC<CraigslistProps> = ({ onNavigate }) => {
  const handleClose = () => {
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
        <Navigation 
          activeFilter="craigslist" 
          onFilterChange={(filter) => {
            if (filter === 'all') onNavigate('home');
            else if (filter === 'ebay') onNavigate('ebay');
          }} 
        />
      </div>

      <StatsComponent stats={mockStats} />

      <div className={styles.listings}>
        {mockCraigslistListings.map((listing) => (
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


import React from 'react';
import { Listing, Stats } from '@/types';
import { Navigation } from '../Navigation/Navigation';
import { Stats as StatsComponent } from '../Stats/Stats';
import { ListingCard } from '../ListingCard/ListingCard';
import styles from './Ebay.module.css';

// Mock data for Ebay listings
const mockStats: Stats = {
  listingsFound: 85,
  averagePrice: '$145.20'
};

const mockEbayListings: Listing[] = [
  {
    id: 'ebay-1',
    title: 'Nike SB Dunk Low \'Matcha\'',
    price: '$125.00',
    platform: 'ebay',
    imageUrl: 'https://via.placeholder.com/96x52/7216C7/FFFFFF?text=Nike+SB'
  },
  {
    id: 'ebay-2',
    title: 'Nike SB Matcha',
    price: '$159.00',
    platform: 'ebay',
    imageUrl: 'https://via.placeholder.com/96x52/FFF071/000000?text=Matcha'
  },
  {
    id: 'ebay-3',
    title: 'Nike SB Dunks',
    price: '$139.00',
    platform: 'ebay',
    imageUrl: 'https://via.placeholder.com/96x52/383838/FFFFFF?text=Dunks'
  },
  {
    id: 'ebay-4',
    title: 'Nike SB Dunk High',
    price: '$165.00',
    platform: 'ebay',
    imageUrl: 'https://via.placeholder.com/96x52/7216C7/FFFFFF?text=High'
  },
  {
    id: 'ebay-5',
    title: 'Nike SB Dunk Low Pro',
    price: '$148.00',
    platform: 'ebay',
    imageUrl: 'https://via.placeholder.com/96x52/FFF071/000000?text=Pro'
  }
];

interface EbayProps {
  onNavigate: (page: string, listingId?: string) => void;
}

export const Ebay: React.FC<EbayProps> = ({ onNavigate }) => {
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
          activeFilter="ebay" 
          onFilterChange={(filter) => {
            if (filter === 'all') onNavigate('home');
            else if (filter === 'craigslist') onNavigate('craigslist');
          }} 
        />
      </div>

      <StatsComponent stats={mockStats} />

      <div className={styles.listings}>
        {mockEbayListings.map((listing) => (
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


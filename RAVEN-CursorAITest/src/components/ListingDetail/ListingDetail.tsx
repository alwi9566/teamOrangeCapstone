import React from 'react';
import { Listing, Stats } from '@/types';
import { Stats as StatsComponent } from '../Stats/Stats';
import styles from './ListingDetail.module.css';

// Mock listing data - in real app, fetch by ID
const mockListing: Listing = {
  id: '1',
  title: 'Nike SB Dunk Low \'Matcha\'',
  price: '$125.00',
  platform: 'all',
  imageUrl: 'https://via.placeholder.com/281x178/7216C7/FFFFFF?text=Nike+SB+Dunk',
  description: 'Nike SB Dunk Low \'Matcha\' Size 10.5 Mens',
  url: '#'
};

const mockStats: Stats = {
  listingsFound: 270,
  averagePrice: '$132.50'
};

interface ListingDetailProps {
  listingId?: string;
  onNavigate: (page: string) => void;
}

export const ListingDetail: React.FC<ListingDetailProps> = ({ listingId, onNavigate }) => {
  // In real app, fetch listing by ID
  const listing = mockListing;

  const handleClose = () => {
    window.close();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => onNavigate('home')}>
          <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 7.5L1 7.5M1 7.5L7.5 1M1 7.5L7.5 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.backLabel}>All</span>
        </button>
        <div className={styles.logo}>
          <span className={styles.logoText}>RAVEN</span>
        </div>
        <button className={styles.closeButton} onClick={handleClose}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L1 13M1 1L13 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.imageSection}>
        {listing.imageUrl && (
          <div className={styles.imageContainer}>
            <img src={listing.imageUrl} alt={listing.title} className={styles.image} />
          </div>
        )}
      </div>

      <div className={styles.content}>
        <p className={styles.price}>{listing.price}</p>
        <h1 className={styles.title}>{listing.title}</h1>

        <button className={styles.viewListingButton}>
          Listing Page
        </button>

        <div className={styles.statsWrapper}>
          <StatsComponent stats={mockStats} />
        </div>
      </div>
    </div>
  );
};


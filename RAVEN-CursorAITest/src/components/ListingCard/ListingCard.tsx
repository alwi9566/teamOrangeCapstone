import React from 'react';
import { Listing } from '@/types';
import styles from './ListingCard.module.css';

interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  return (
    <div className={styles.card} onClick={onClick}>
      {listing.imageUrl && (
        <div className={styles.imageContainer}>
          <img src={listing.imageUrl} alt={listing.title} className={styles.image} />
          <div className={styles.imageOverlay} />
        </div>
      )}
      <div className={styles.content}>
        <p className={styles.price}>{listing.price}</p>
        <p className={styles.title}>{listing.title}</p>
      </div>
    </div>
  );
};


import React from 'react';
import { PlatformFilter } from '@/types';
import styles from './Navigation.module.css';

interface NavigationProps {
  activeFilter: PlatformFilter;
  onFilterChange: (filter: PlatformFilter) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <nav className={styles.navigation}>
      <button
        className={`${styles.navButton} ${activeFilter === 'all' ? styles.active : ''}`}
        onClick={() => onFilterChange('all')}
      >
        <span className={activeFilter === 'all' ? styles.activeText : ''}>All</span>
      </button>
      <button
        className={`${styles.navButton} ${activeFilter === 'craigslist' ? styles.active : ''}`}
        onClick={() => onFilterChange('craigslist')}
      >
        <span className={activeFilter === 'craigslist' ? styles.activeText : ''}>Craigslist</span>
      </button>
      <button
        className={`${styles.navButton} ${activeFilter === 'ebay' ? styles.active : ''}`}
        onClick={() => onFilterChange('ebay')}
      >
        <span className={activeFilter === 'ebay' ? styles.activeText : ''}>Ebay</span>
      </button>
    </nav>
  );
};


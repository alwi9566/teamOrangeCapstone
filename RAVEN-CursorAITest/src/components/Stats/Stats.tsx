import React from 'react';
import { Stats as StatsType } from '@/types';
import styles from './Stats.module.css';

interface StatsProps {
  stats: StatsType;
}

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  return (
    <div className={styles.stats}>
      <div className={styles.statCard}>
        <p className={styles.statValue}>{stats.listingsFound}</p>
        <p className={styles.statLabel}>Listings Found</p>
      </div>
      <div className={styles.statCard}>
        <p className={styles.statValue}>{stats.averagePrice}</p>
        <p className={styles.statLabel}>Average Price</p>
      </div>
    </div>
  );
};


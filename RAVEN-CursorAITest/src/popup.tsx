import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Home } from './components/Home/Home';
import { Ebay } from './components/Ebay/Ebay';
import { Craigslist } from './components/Craigslist/Craigslist';
import { ListingDetail } from './components/ListingDetail/ListingDetail';
import { Page } from './types';
import './styles/global.css';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedListingId, setSelectedListingId] = useState<string | undefined>();

  const handleNavigate = (page: Page, listingId?: string) => {
    setCurrentPage(page);
    if (listingId) {
      setSelectedListingId(listingId);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'ebay':
        return <Ebay onNavigate={handleNavigate} />;
      case 'craigslist':
        return <Craigslist onNavigate={handleNavigate} />;
      case 'listing-detail':
        return <ListingDetail listingId={selectedListingId} onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return <>{renderPage()}</>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// Location: src/components/TransactionFeed.tsx
'use client';

import { useEffect, useState } from 'react';
import { TransactionCard } from './TransactionCard';
import { 
  normalizeDbTransaction, 
  normalizeAlchemyTransaction, 
  NormalizedTransaction,
  isTransferWithMetadata // Import our type guard
} from '../lib/utils';
import { SkeletonCard } from './SkeletonCard'; 

// Import the specific types we need
import type { Transaction as DbTransaction } from '../app/api/transactions/route';
import type { AssetTransfersResponse } from 'alchemy-sdk';

// This is the inferred type for a single transfer, which might not have metadata
type AlchemyAssetTransfer = AssetTransfersResponse['transfers'][number];

export const TransactionFeed = () => {
  const [mainFeed, setMainFeed] = useState<NormalizedTransaction[]>([]);
  const [previewFeed, setPreviewFeed] = useState<NormalizedTransaction[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [previewAddress, setPreviewAddress] = useState('');
  const [activeFeed, setActiveFeed] = useState<'main' | 'preview'>('main');

  // --- Fetching and Normalizing Logic for Main Feed ---
  const fetchMainTransactions = async () => {
    // Only set loading on the initial fetch
    if (!mainFeed.length) setIsLoading(true);
    try {
      const res = await fetch('/api/transactions');
      if (!res.ok) throw new Error('Failed to fetch main feed');
      const data: DbTransaction[] = await res.json();
      setMainFeed(data.map(normalizeDbTransaction));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Fetching and Normalizing Logic for Preview Feed ---
// Inside src/components/TransactionFeed.tsx

const handlePreview = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!previewAddress) return;
  
  setIsPreviewLoading(true);
  setActiveFeed('preview');
  setPreviewFeed([]);
  setError(null);
  try {
    const res = await fetch(`/api/preview?address=${previewAddress}`);
    if (!res.ok) throw new Error('Failed to fetch preview data');
    
    // Explicitly type the raw data array
    const rawTransfers: AlchemyAssetTransfer[] = await res.json();
    
    // Use the type guard to filter and narrow the type
    const normalized = rawTransfers
      .filter(isTransferWithMetadata)
      .map(normalizeAlchemyTransaction);

    setPreviewFeed(normalized);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsPreviewLoading(false);
  }
};

  useEffect(() => {
    fetchMainTransactions();

    // Set up polling for the main feed
    const interval = setInterval(fetchMainTransactions, 20000); // Check every 20 seconds
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only once on mount

  const renderFeed = () => {
    const feedData = activeFeed === 'main' ? mainFeed : previewFeed;
    const loadingState = activeFeed === 'main' ? isLoading : isPreviewLoading;

    if (loadingState) {
      // Render 5 skeleton cards while loading
      return (
        <div>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      );
    }
    
    if (error && (activeFeed === 'main' && !mainFeed.length || activeFeed === 'preview' && !previewFeed.length)) {
      return <p className="text-center text-red-500">Error: {error}</p>;
    }
    if (feedData.length === 0) return <p className="text-center">No transactions found.</p>;

    // Use a more robust key that includes the log index for uniqueness
    return feedData.map((tx, index) => <TransactionCard key={`${tx.hash}-${index}`} tx={tx} />);
  };

  return (
    <div>
      {/* Input Form */}
      <form onSubmit={handlePreview} className="mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <label htmlFor="address-input" className="block text-sm font-medium text-gray-300 mb-2">
          Preview Wallet Activity
        </label>
        <div className="flex gap-2">
          <input
            id="address-input"
            type="text"
            value={previewAddress}
            onChange={(e) => setPreviewAddress(e.target.value)}
            placeholder="Enter wallet address (e.g., vitalik.eth)"
            className="w-full bg-gray-900 border border-gray-600 rounded-md p-2 text-white font-mono"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-blue-800/50"
            disabled={isPreviewLoading}
          >
            {isPreviewLoading ? '...' : 'Preview'}
          </button>
        </div>
      </form>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700 mb-4">
        <button onClick={() => { setActiveFeed('main'); setError(null); }} className={`py-2 px-4 ${activeFeed === 'main' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>
          Main Watchlist
        </button>
        <button onClick={() => { setActiveFeed('preview'); setError(null); }} className={`py-2 px-4 ${activeFeed === 'preview' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`} disabled={previewFeed.length === 0 && !isPreviewLoading}>
          Preview
        </button>
      </div>

      {/* Content */}
      <div className="feed-content">
        {renderFeed()}
      </div>
    </div>
  );
};
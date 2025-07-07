// Location: src/components/AddressPill.tsx
'use client';

import { useEffect, useState } from 'react';
import { shortenAddress } from '../lib/utils';

interface EnsInfo {
  ensName: string | null;
  avatar: string | null;
}

export const AddressPill = ({ address }: { address: string }) => {
  const [ensInfo, setEnsInfo] = useState<EnsInfo | null>(null);

  useEffect(() => {
    // Don't fetch if there's no address
    if (!address) return;

    let isMounted = true;
    const fetchEns = async () => {
      try {
        const res = await fetch(`/api/resolveEns?address=${address}`);
        if (!res.ok) return;
        const data = await res.json();
        if (isMounted) {
          setEnsInfo(data);
        }
      } catch (error) {
        console.error("Failed to fetch ENS info", error);
      }
    };

    fetchEns();

    // Cleanup function to prevent state updates on unmounted components
    return () => {
      isMounted = false;
    };
  }, [address]); // Re-run effect if the address prop changes

  const displayName = ensInfo?.ensName || shortenAddress(address);

  return (
    <a 
      href={`https://etherscan.io/address/${address}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      {ensInfo?.avatar ? (
        <img src={ensInfo.avatar} alt={displayName} className="w-5 h-5 rounded-full bg-gray-700" />
      ) : (
        <div className="w-5 h-5 rounded-full bg-gray-600"></div> // Placeholder
      )}
      <span className="font-mono">{displayName}</span>
    </a>
  );
};
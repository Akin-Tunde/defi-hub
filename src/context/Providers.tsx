// Final version of src/context/Providers.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import Link from 'next/link';

const Web3ProviderDynamic = dynamic(
  () => import('./Web3Provider').then((mod) => mod.Web3Provider),
  {
    ssr: false,
    loading: () => <p className="text-center mt-8">Loading Wallet Connector...</p>, 
  }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Web3ProviderDynamic>
        <header className="bg-gray-800 p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-white">DeFi Hub</Link>
            {/* We'll make this a smart component later */}
            <w3m-button /> 
          </nav>
        </header>
      {children}
    </Web3ProviderDynamic>
  );
}
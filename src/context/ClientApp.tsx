// Location: src/context/ClientApp.tsx
'use client' // This is the most important line!

import { Web3Provider } from './Web3Provider'
import Link from 'next/link'

export function ClientApp({ children }: { children: React.ReactNode }) {
  // Since this whole component is client-side, the provider will be too.
  return (
    <Web3Provider>
        <header className="bg-gray-800 p-4">
          <nav className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-white">DeFi Hub</Link>
            <Link href="/auth" className="text-white hover:underline">Login</Link>
          </nav>
        </header>
        {children}
    </Web3Provider>
  )
}
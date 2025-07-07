// Location: src/app/page.tsx
import { TransactionFeed } from '../components/TransactionFeed';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-12 md:p-24 bg-gray-900 text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm mb-8">
        <h1 className="text-4xl font-bold text-center">DeFi Intelligence Hub</h1>
        <p className="text-center text-gray-400 mt-2">Live Transactions from Watched Wallets</p>
      </div>
      
      <div className="w-full max-w-2xl">
        <TransactionFeed />
      </div>
    </main>
  );
}
// Location: src/components/TransactionCard.tsx
import { NormalizedTransaction, shortenAddress } from '../lib/utils';
import { AddressPill } from './AddressPill';

// A helper to format numbers gracefully
const formatValue = (value: number | null) => {
  if (value === null) return '';
  if (value > 0.0001) {
    return value.toFixed(4);
  }
  if (value === 0) {
    return '0';
  }
  return value.toExponential(2); // e.g., 2.00e-8
};

export const TransactionCard = ({ tx }: { tx: NormalizedTransaction }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md border border-gray-700 mb-4 animate-fade-in">
      <div className="flex justify-between items-center mb-2">
        <a 
          href={`https://etherscan.io/tx/${tx.hash}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-mono text-blue-400 hover:underline"
        >
          Tx: {tx.hash.substring(0, 10)}...
        </a>
        <span className="text-xs text-gray-400">
          {new Date(tx.timestamp).toLocaleString()}
        </span>
      </div>
      
      {/* --- THE UPGRADE IS HERE --- */}
      <div className="text-sm space-y-2 mt-3">
        <div className="flex items-center gap-3">
          <span className="text-gray-500 w-12 text-right">From:</span>
          <div className="text-indigo-400">
            <AddressPill address={tx.from} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 w-12 text-right">To:</span>
          <div className="text-purple-400">
            <AddressPill address={tx.to} />
          </div>
        </div>
      </div>
      {/* --- END UPGRADE --- */}

      <div className="mt-3 text-right">
        <span className="text-lg font-bold text-green-400">
          {formatValue(tx.value)} {tx.asset}
        </span>
      </div>
    </div>
  );
};
// Location: src/lib/utils.ts

import type { Transaction as DbTransaction } from '../app/api/transactions/route';
import type { AssetTransfersResult } from 'alchemy-sdk';

// This is our base type, as imported from the SDK.
export type AlchemyAssetTransfer = AssetTransfersResult;

// This is our more specific, desired type.
type AlchemyAssetTransferWithMetadata = AlchemyAssetTransfer & {
  metadata: {
    blockTimestamp: string;
  };
};

// --- THE DEFINITIVE FIX IS HERE ---
// The Type Guard function with explicit checks
export function isTransferWithMetadata(tx: AlchemyAssetTransfer): tx is AlchemyAssetTransferWithMetadata {
  // We check for the existence of 'metadata' as a property on the object,
  // and then we check the property on the nested object.
  // This is a safe, runtime check that also satisfies the TypeScript compiler.
  return (
    'metadata' in tx &&
    tx.metadata !== null &&
    typeof (tx.metadata as any).blockTimestamp === 'string'
  );
}

// The universal, normalized format for our UI
export interface NormalizedTransaction {
  hash: string;
  from: string;
  to: string;
  value: number | null;
  asset: string;
  timestamp: string;
}

// A utility to shorten addresses
export const shortenAddress = (address: string) => 
  address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';

// Normalizer for data from our Supabase DB
export function normalizeDbTransaction(tx: DbTransaction): NormalizedTransaction {
  return {
    hash: tx.hash,
    from: tx.from_address,
    to: tx.to_address,
    value: tx.value_eth,
    asset: 'ETH',
    timestamp: tx.timestamp,
  };
}

// Normalizer for data from Alchemy's API. It correctly uses the specific type.
export function normalizeAlchemyTransaction(tx: AlchemyAssetTransferWithMetadata): NormalizedTransaction {
  return {
    hash: tx.hash,
    from: tx.from,
    to: tx.to || 'Unknown',
    value: tx.value ?? null,
    asset: tx.asset || 'Unknown',
    timestamp: tx.metadata.blockTimestamp,
  };
}
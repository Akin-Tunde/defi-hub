// Location: src/api/transactions/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// It's safe to use these keys here because this code only runs on the server
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define a type for our transaction data for type safety
export interface Transaction {
  id: number;
  hash: string;
  from_address: string;
  to_address: string;
  value_eth: number;
  timestamp: string;
}

// By default, Next.js caches API routes. We want fresh data.
export const dynamic = 'force-dynamic';

// The API handler for GET requests
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('timestamp', { ascending: false }) // Get the newest first
      .limit(50); // Limit to the last 50 transactions

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: `Failed to fetch transactions: ${error.message}` },
      { status: 500 }
    );
  }
}
// Location: src/app/api/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
// We don't even need the full alchemy-sdk for this approach, just fetch
import { fetch } from 'undici';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const alchemyUrl = process.env.ALCHEMY_HTTPS_URL;
  if (!alchemyUrl) {
    return NextResponse.json(
      { error: 'Server configuration error: Missing Alchemy API Key.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address || typeof address !== 'string') {
    return NextResponse.json(
      { error: 'Address query parameter is required.' },
      { status: 400 }
    );
  }

  // --- MANUAL JSON-RPC REQUEST ---

  const requestBody = {
    id: 1,
    jsonrpc: "2.0",
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        toAddress: address,
        category: ["external", "internal", "erc20", "erc721", "erc1155"],
        withMetadata: true,
        maxCount: "0x19",
        order: "desc"
      },
      {
        fromBlock: "0x0",
        fromAddress: address,
        category: ["external", "internal", "erc20", "erc721", "erc1155"],
        withMetadata: true,
        maxCount: "0x19",
        order: "desc"
      }
    ]
  };

  try {
    // We will fire two requests, one for TO and one for FROM, then combine.
    const toPromise = fetch(alchemyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ ...requestBody, params: [requestBody.params[0]] }) // Only the 'to' params
    }).then(res => res.json());

    const fromPromise = fetch(alchemyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ ...requestBody, params: [requestBody.params[1]] }) // Only the 'from' params
    }).then(res => res.json());

    // Wait for both requests to complete
    const [toResponse, fromResponse]: any[] = await Promise.all([toPromise, fromPromise]);

    if (toResponse.error || fromResponse.error) {
        console.error("Alchemy API Error:", toResponse.error || fromResponse.error);
        throw new Error(toResponse.error?.message || fromResponse.error?.message || "An unknown Alchemy error occurred");
    }

    const allTransfers = [...(toResponse.result?.transfers || []), ...(fromResponse.result?.transfers || [])]
      .sort((a, b) => Number(b.blockNum) - Number(a.blockNum));

    const uniqueTransfers = Array.from(new Map(allTransfers.map(item => [item.uniqueId, item])).values()).slice(0, 25);
    
    return NextResponse.json(uniqueTransfers);

  } catch (error: any) {
    console.error("Direct Fetch Error:", error);
    return NextResponse.json(
      { error: `Failed to fetch transfers: ${error.message}` },
      { status: 500 }
    );
  }
}
// Location: src/app/api/resolveEns/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Alchemy, Network, Nft } from 'alchemy-sdk'; // Import the Nft type

const settings = {
  apiKey: process.env.ALCHEMY_HTTPS_URL!.split('/').pop(),
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const ensName = await alchemy.core.lookupAddress(address);
    let avatar = null;

    if (ensName) {
      try {
        const ensMetadata: Nft = await alchemy.nft.getNftMetadata(
          "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
          ensName
        );
        
        // --- THE EXPLICIT, FOOLPROOF FIX ---
        // Manually check if the 'media' property exists and is an array
        if (
          'media' in ensMetadata && 
          Array.isArray(ensMetadata.media) && 
          ensMetadata.media.length > 0
        ) {
          // Now TypeScript knows ensMetadata.media exists and is an array.
          // Check if the first item in the array has a 'gateway' property.
          const firstMediaItem = ensMetadata.media[0];
          if (firstMediaItem && 'gateway' in firstMediaItem) {
            avatar = firstMediaItem.gateway || null;
          }
        }
        // If any of these checks fail, avatar simply remains null.

      } catch (nftError) {
        console.warn(`Could not fetch avatar for ${ensName}:`, nftError);
        avatar = null;
      }
    }

    return NextResponse.json({ ensName, avatar });

  } catch (error) {
    console.error("Outer ENS Resolution Error:", error);
    return NextResponse.json({ ensName: null, avatar: null });
  }
}
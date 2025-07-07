require('dotenv').config();
const { Alchemy, Network } = require('alchemy-sdk');
const { createClient } = require('@supabase/supabase-js');

// --- Configuration ---
const alchemyApiKey = process.env.ALCHEMY_HTTPS_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// A list of wallets we want to watch
// For now, we'll use a well-known address: the vitalik.eth wallet
const WATCH_LIST = [
  "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", // vitalik.eth
  "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"  // Uniswap V3: Router 2
];
// --- Sanity Checks ---
if (!alchemyApiKey || !supabaseUrl || !supabaseKey) {
  throw new Error("Missing environment variables. Check your .env.local file.");
}

// --- Initialize Clients ---
const settings = {
  apiKey: alchemyApiKey.split('/').pop(),
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(settings);
const supabase = createClient(supabaseUrl, supabaseKey);

// --- Main Function ---
async function main() {
  console.log("🚀 Starting DeFi Hub listener...");
  console.log(`👀 Watching ${WATCH_LIST.length} wallet(s)...`);
  console.log("-------------------------------------------------");

  // Add the type annotation here
  alchemy.ws.on("block", async (blockNumber: number) => {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] ⛓️ New Block Mined: ${blockNumber}`);
      
      const block = await alchemy.core.getBlockWithTransactions(blockNumber);
      
      // The rest of the code remains the same...
      for (const tx of block.transactions) {
        const from = tx.from.toLowerCase();
        const to = tx.to?.toLowerCase();

        if (WATCH_LIST.some(addr => addr.toLowerCase() === from || addr.toLowerCase() === to)) {
          console.log(`🎉 Found interesting transaction! Hash: ${tx.hash}`);

          const transactionData = {
            hash: tx.hash,
            from_address: tx.from,
            to_address: tx.to,
            value_eth: parseFloat(tx.value.toString()) / 1e18,
            timestamp: new Date(block.timestamp * 1000).toISOString(),
          };

          const { data, error } = await supabase
            .from('transactions')
            .insert([transactionData])
            .select();

          if (error) {
            console.error("❌ Supabase Insert Error:", error.message);
          } else {
            console.log("✅ Successfully saved transaction to database:", data);
          }
        }
      }
    } catch (error) {
      console.error("Error processing block:", error);
    }
  });
}

// --- Execute ---
main().catch((error) => {
  console.error("A critical error occurred:", error);
  process.exit(1);
});
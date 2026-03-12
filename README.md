# Solana Wallet App

A simple React application to interact with the Solana network.

## Features
- Create a new Solana wallet (generate Keypair).
- Connect existing wallets (using Solana Wallet Adapter).
- View SOL balance.
- Transfer SOL to other addresses.
- Receive SOL (by sharing your public key).

## Development

```bash
npm install
npm run dev
```

## How to Deploy the Website on the Solana Network

Deploying a *website* "on the Solana network" usually means one of two things:

### 1. Hosting on a Decentralized Storage Network (Permanent Web)
Since Solana itself is a blockchain for smart contracts and transactions, it doesn't host website files (HTML/CSS/JS) directly in a traditional sense. Instead, you use decentralized storage that integrates well with the Solana ecosystem.

#### Option A: Arweave (Permanent Storage)
Arweave is often used with Solana for permanent storage (e.g., Metaplex NFTs).
1. Use a tool like `arkb` or `bundlr`.
2. `npm install -g arkb`
3. `arkb deploy dist/ --wallet path/to/arweave-keyfile.json`

#### Option B: IPFS
1. Build your app: `npm run build`
2. Upload the `dist/` folder to an IPFS provider like Pinata or Infura.
3. Access it via an IPFS gateway.

### 2. Traditional Hosting with Solana Integration (Most Common)
Most "Solana websites" are hosted on Vercel, Netlify, or GitHub Pages but interact with the Solana network via an RPC provider.

#### To deploy on Vercel:
1. Push your code to GitHub.
2. Connect your repo to Vercel.
3. Vercel will automatically build and deploy your React app.

## Interacting with the Solana Network
The website uses `@solana/web3.js` to communicate with Solana RPC nodes. By default, this app is configured to use **Devnet**.

To change to Mainnet, update `src/App.tsx`:
```typescript
const network = WalletAdapterNetwork.Mainnet;
```

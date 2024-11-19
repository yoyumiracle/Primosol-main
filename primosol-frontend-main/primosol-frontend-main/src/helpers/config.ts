import { Connection, PublicKey } from "@solana/web3.js";

export const DEFAULT_TOKEN = 'So11111111111111111111111111111111111111112';
export const USDC_TOKEN_ADDRESS = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const connection = new Connection(import.meta.env.VITE_MAINNET_RPC_URL, 'confirmed');
export const TIP_ACCT = new PublicKey('ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt');
import { Request, Response } from 'express';
import { decryptPKey, sendResponse } from '../utils/global_utils';
import { sendTransaction, swapToken, transferFunds } from '../utils/swap';
import * as db from '../models';
import { fetchTokenBalance, getTokenMetadata, getWalletFromPrivateKey, getWalletSOLBalance, updateSwapDb } from '../utils/sol_utils';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import { SOL_CONFIG } from '../config/config';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface BuySellRequest {
    fromToken: string;
    toToken: string;
    amount: number;
    slippage: number;
    trxPriority: number;
}

export const swap = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        const user = await db.getUserById(userId);
        if (user && user.deposit_pk && user.deposit_wallet) {
            const pkey = decryptPKey(user.deposit_pk)
            const keyPair = getWalletFromPrivateKey(pkey).keyPair
            const { fromToken, toToken, amount, slippage, trxPriority } = req.body as BuySellRequest;
            const toTokenInfo = await getTokenMetadata(toToken)
            if (toTokenInfo) {
                const prev_toBalance = toToken === SOL_CONFIG.WSOL_ADDRESS ?
                    await getWalletSOLBalance(new PublicKey(user.deposit_wallet)) / LAMPORTS_PER_SOL :
                    await fetchTokenBalance(user.deposit_wallet, toToken, toTokenInfo.decimals)
                const trxId = await swapToken(keyPair, fromToken, toToken, amount, slippage, trxPriority);
                if (trxId) {
                    updateSwapDb(user, fromToken, amount, toToken, toTokenInfo.decimals, prev_toBalance, trxId)
                    return sendResponse(res, 200, true, { data: trxId }, "swap successfully");
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
    return sendResponse(res, 400, false, { error: "swap error" }, "swap error");
};

export const depositFunds = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        const user = await db.getUserById(userId);
        if (user && user.deposit_pk && user.deposit_wallet) {
            const { trx, amount } = req.body;
            const trxBuffer = Buffer.from(trx, 'base64');
            const transaction = VersionedTransaction.deserialize(trxBuffer)
            const trxId = await sendTransaction(transaction)
            if (trxId) {
                await db.addTrx({
                    wallet: user.wallet,
                    type: "deposit",
                    fromMint: user.wallet,
                    from_amount: amount,
                    toMint: user.deposit_wallet,
                    to_amount: 0,
                    trxId: trxId,
                    timeStamp: Date.now()
                })
                return sendResponse(res, 200, true, { data: trxId }, "deposit success");
            }
        }
    } catch (error) {
        console.log(error)
    }

    return sendResponse(res, 400, false, { error: "deposit error" }, "deposit error");
}

export const withdrawFunds = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        const user = await db.getUserById(userId);
        if (user && user.deposit_pk && user.deposit_wallet) {
            const { amount } = req.body;
            const pkey = decryptPKey(user.deposit_pk)
            const keyPair = getWalletFromPrivateKey(pkey).keyPair
            const trxId = await transferFunds(keyPair, user.wallet, amount, user.trxPriority)
            if (trxId) {
                await db.addTrx({
                    wallet: user.wallet,
                    type: "withdraw",
                    fromMint: user.deposit_wallet,
                    from_amount: amount,
                    toMint: user.wallet,
                    to_amount: 0,
                    trxId: trxId,
                    timeStamp: Date.now()
                })
                return sendResponse(res, 200, true, { data: trxId }, "withdraw success");
            }
        }
    } catch (error) {
        console.log(error)
    }

    return sendResponse(res, 400, false, { error: "deposit error" }, "withdraw error");
}
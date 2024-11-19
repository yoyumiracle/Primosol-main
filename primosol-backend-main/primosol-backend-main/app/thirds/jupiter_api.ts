import dotenv from 'dotenv';
import { fetchAPI } from '../utils/global_utils';
import { VersionedTransaction } from '@solana/web3.js';

dotenv.config();

export const getSwapInfo = async (
    tokenFrom: string,
    tokenTo: string,
    amount: number,
    decimal: number,
    slippage: number
) => {
    try {
        amount = Math.floor(amount * 10 ** decimal);
        slippage = Math.floor(slippage * 10 ** 2);

        const url = `https://quote-api.jup.ag/v6/quote?inputMint=${tokenFrom}&outputMint=${tokenTo}&amount=${amount}&slippageBps=${slippage}`;
        const resp = await fetchAPI(url, 'GET');
        return resp;
    } catch (error) {
        console.log('getSwapInfo', error);
        return null;
    }
};

export const buildSwapTrx = async (
    wallet: string,
    swapInfoResp: any
): Promise<VersionedTransaction | null> => {
    try {
        const resp: any = await fetchAPI('https://quote-api.jup.ag/v6/swap', 'POST', {
            quoteResponse: swapInfoResp,
            userPublicKey: wallet,
            wrapAndUnwrapSol: true,
        });

        if (!resp) {
            return null;
        }

        const { swapTransaction } = resp;

        if (swapTransaction) {
            const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
            const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
            return transaction;
        }
    } catch (error) {
        console.error('buildSwapTrx: ', error);
    }

    return null;
};

export const getTokenPrice = async (
    targetToken: string,
    quoteToken: string,
): Promise<number> => {
    try {
        const url = `https://price.jup.ag/v4/price?ids=${targetToken}&vsToken=${quoteToken}`;
        const resp: any = await fetchAPI(url, 'GET');

        if (resp && resp.data && resp.data[targetToken]) {
            return resp.data[targetToken].price;
        }
    } catch (error) {
        console.log('getTokenPrice', error);
    }
    return 0;
};
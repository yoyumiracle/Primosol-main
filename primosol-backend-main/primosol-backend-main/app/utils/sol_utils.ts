import { Metaplex } from '@metaplex-foundation/js'
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getMint } from "@solana/spl-token";
import { Connection, Keypair, ParsedTransactionWithMeta, PublicKey, TransactionConfirmationStatus, VersionedTransaction } from '@solana/web3.js'
import bs58 from 'bs58'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';
import { CONFIG, SOL_CONFIG } from '../config/config';
import { IUSER } from '../models';
import * as db from '../models';
import { DelayDetector } from './delay_detector';
import { sleep } from './global_utils';

const connection = new Connection(CONFIG.MAINNET_RPC, "confirmed");

export const generateNewWallet = () => {
    const keypair = Keypair.generate()

    const publicKey = keypair.publicKey.toBase58()
    const secretKey = bs58.encode(keypair.secretKey)
    return { publicKey, secretKey }
}

export const getWalletFromPrivateKey = (privateKey: string) => {

    const key = bs58.decode(privateKey)
    const keypair = Keypair.fromSecretKey(key);

    const publicKey = keypair.publicKey.toBase58()
    const secretKey = bs58.encode(keypair.secretKey)

    return { publicKey, secretKey, keyPair: keypair }
}

export const getWalletSOLBalance = async (publicKey: PublicKey) => {

    try {
        let balance = await connection.getBalance(publicKey)
        return balance
    } catch (error) {
        console.log(error)
    }

    return 0
}

export const getConfirmation = async (trx: string): Promise<TransactionConfirmationStatus | undefined> => {
    const result = await connection.getSignatureStatus(trx, {
        searchTransactionHistory: true,
    });

    return result.value?.confirmationStatus;
}

export const delayForTrxSync = async (signature: string) => {

    const delayDetector = new DelayDetector('delayForTrxSync')
    while (delayDetector.estimate(false) < 60 * 1000) {
        if (await getConfirmation(signature) === 'finalized') {
            break
        }

        await sleep(1000)
    }
}

export const getTokenMetadata = async (address: string) => {
    try {
        const metaplex = Metaplex.make(connection);
        const mintAddress = new PublicKey(address);
        const token = await metaplex.nfts().findByMint({ mintAddress: mintAddress });
        let mintInfo = null
        let totalSupply = 0
        let token_type = "spl-token"
        if (token) {
            const name = token.name;
            const symbol = token.symbol;
            const logo = token.json?.image;
            const description = token.json?.description;
            const extensions = token.json?.extensions;
            const decimals = token.mint.decimals;
            const renounced = token.mint.mintAuthorityAddress ? false : true;

            if (token.mint.currency.namespace === "spl-token") {
                mintInfo = await getMint(connection, mintAddress, "confirmed", TOKEN_PROGRAM_ID)
                token_type = "spl-token"
            } else {
                mintInfo = await getMint(connection, mintAddress, "confirmed", TOKEN_2022_PROGRAM_ID)
                token_type = "spl-token-2022"
            }
            if (mintInfo) {
                totalSupply = Number(mintInfo.supply / BigInt(10 ** decimals))
            }
            return { name, symbol, logo, decimals, address, totalSupply, description, extensions, renounced, type: token_type }
        } else {
            console.log("utils.getTokenMetadata tokenInfo", token);
        }

    } catch (error) {
        console.log("getTokenMetadata", error);
    }

    return null
}

export const fetchTokenBalance = async (
    walletAddress: string,
    tokenAddress: string,
    tokenDecimals: number
) => {
    const { data } = await axios.post(CONFIG.MAINNET_RPC, {
        jsonrpc: '2.0',
        id: walletAddress,
        method: 'getTokenAccountsByOwner',
        params: [
            walletAddress,
            {
                mint: tokenAddress
            },
            {
                encoding: 'jsonParsed'
            }
        ]
    })
    if (Array.isArray(data?.result?.value) && data?.result?.value?.length > 0) {

        return Number(
            data?.result?.value[0]?.account?.data?.parsed?.info?.tokenAmount?.amount
        ) /
            10 ** tokenDecimals
    } else {
        return 0
    }
}

export const updateSwapDb = async (user: any, fromToken: string, from_amount: number, toToken: string, toTokenDecimals: number, prev_to_balance: number, trxId: string, orderbook_id: string | undefined = undefined) => {
    await delayForTrxSync(trxId)
    const next_to_balance = toToken === SOL_CONFIG.WSOL_ADDRESS ?
        await getWalletSOLBalance(new PublicKey(user.deposit_wallet)) / LAMPORTS_PER_SOL :
        await fetchTokenBalance(user.deposit_wallet, toToken, toTokenDecimals)

    db.addTrx({
        wallet: user.wallet,
        type: "swap",
        fromMint: fromToken,
        from_amount: from_amount,
        toMint: toToken,
        to_amount: next_to_balance - prev_to_balance,
        orderbook_id: orderbook_id,
        trxId: trxId,
        timeStamp: Date.now()
    })
}

export const sendAndConfirmTransactions = async (tx: VersionedTransaction) => {
    const connection = new Connection(CONFIG.SEND_RPC, "confirmed");
    const rawTransaction = tx.serialize()
    console.log("Sending Transaction ...", bs58.encode(tx.signatures[0]))
    const startTime = new Date().getTime()
    while (true) {
        try {
            let endTime = new Date().getTime()
            if ((endTime - startTime) / 1000 > 90) {
                console.log("Sending Transaction Failed", bs58.encode(tx.signatures[0]))
                break;
            }
            const txid = await connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
                maxRetries: 2
            });
            let res = await connection.confirmTransaction(txid);
            if (res.value.err) {
                console.log("Confirming Transaction failed", res.value.err);
                break;
            }
            endTime = new Date().getTime()
            console.log("Confirmed Transaction ... Delay: ", bs58.encode(tx.signatures[0]), (endTime - startTime) / 1000)
            return txid;
        } catch (error) {
            
            console.log("Sending Transaction Error", bs58.encode(tx.signatures[0]))
            await sleep(1000);
        }
    }
    return null;
};
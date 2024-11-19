import { AddressLookupTableAccount, ComputeBudgetProgram, Connection, Keypair, TransactionMessage, VersionedTransaction } from "@solana/web3.js"
import { CONFIG, SOL_CONFIG } from "../config/config";
import { getTokenMetadata, getWalletSOLBalance, sendAndConfirmTransactions } from "./sol_utils";
import * as jpAPI from "../thirds/jupiter_api"
import * as jitoBundler from './jito';
import { SystemProgram } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(CONFIG.MAINNET_RPC, "confirmed");
const jito_bundler = new jitoBundler.JitoBundler()

export const swapToken = async (keyPair: Keypair, fromToken: string, toToken: string, amount: number, slippage: number, tip: number) => {
    try {
        console.log(amount, fromToken, toToken)
        const fromTokenMetaInfo = await getTokenMetadata(fromToken)
        if (fromTokenMetaInfo) {
            console.log("swapinfo", fromToken, toToken, amount, fromTokenMetaInfo.decimals, slippage, tip)

            const swapInfoResp: any = await jpAPI.getSwapInfo(fromToken, toToken, amount, fromTokenMetaInfo.decimals, slippage)
            if (!swapInfoResp || swapInfoResp.error) {
                return null
            }
            let trx = await jpAPI.buildSwapTrx(keyPair.publicKey.toBase58(), swapInfoResp)

            if (!trx) {
                return null
            }
            let fee = amount * CONFIG.FEE / 100
            if (toToken === SOL_CONFIG.WSOL_ADDRESS) {
                const solAmount = Number(swapInfoResp.outAmount) / LAMPORTS_PER_SOL
                fee = solAmount * CONFIG.FEE / 100
            }
            const feeInstruction = SystemProgram.transfer({
                fromPubkey: keyPair.publicKey,
                toPubkey: new PublicKey(CONFIG.FEE_WALLET),
                lamports: Math.floor(fee * LAMPORTS_PER_SOL),
            })
            // const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: tip * LAMPORTS_PER_SOL });

            const addressLookupTableAccounts = await Promise.all(
                trx.message.addressTableLookups.map(async (lookup) => {
                    return new AddressLookupTableAccount({
                        key: lookup.accountKey,
                        state: AddressLookupTableAccount.deserialize(await connection.getAccountInfo(lookup.accountKey).then((res: any) => res.data)),
                    })
                }))
        
            let message = TransactionMessage.decompile(trx.message, { addressLookupTableAccounts: addressLookupTableAccounts })
            
            message.instructions = [...message.instructions, feeInstruction]
            message.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
            trx.message = message.compileToV0Message(addressLookupTableAccounts)
            trx.sign([keyPair])
            let signatures = await jito_bundler.sendBundles(connection, [trx], [keyPair], tip, 2) //await sendAndConfirmTransactions(trx)//
            if (signatures && signatures.length > 0) {
                return signatures[0]
            }
        }
    } catch (error) {
        console.log(`swap ${toToken}`, error)
    }
    return null
}

export const sendTransaction = async (transaction: VersionedTransaction) => {
    let signatures = await jito_bundler.sendBundles(connection, [transaction])
    if (signatures && signatures.length > 0) {
        return signatures[0]
    }
    return null
}

export const transferFunds = async (from: Keypair, to: string, amount: number, tip: number) => {
    const sol_balance = await getWalletSOLBalance(from.publicKey)
    let transferAmount = amount * LAMPORTS_PER_SOL
    if (sol_balance < (amount + tip) * LAMPORTS_PER_SOL + SOL_CONFIG.BASE_FEE) {
        transferAmount = sol_balance - (tip * LAMPORTS_PER_SOL) - SOL_CONFIG.BASE_FEE
    }
    const transferInstruction = SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: new PublicKey(to),
        lamports: transferAmount,
    });

    const messageV0 = new TransactionMessage({
        payerKey: from.publicKey,
        recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
        instructions: [transferInstruction]
    }).compileToV0Message()
    const versionedTransaction = new VersionedTransaction(messageV0)
    versionedTransaction.sign([from])

    let signatures = await jito_bundler.sendBundles(connection, [versionedTransaction], [from], tip)
    if (signatures && signatures.length > 0) {
        return signatures[0]
    }
    return null
}
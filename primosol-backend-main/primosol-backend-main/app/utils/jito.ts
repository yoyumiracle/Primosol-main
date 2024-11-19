import { searcherClient } from 'jito-ts/dist/sdk/block-engine/searcher';
import { Bundle } from 'jito-ts/dist/sdk/block-engine/types';

import {
	Keypair,
	LAMPORTS_PER_SOL,
	PublicKey,
} from '@solana/web3.js';
import { sleep } from './global_utils';
import { Connection } from '@solana/web3.js';
import { VersionedTransaction } from '@solana/web3.js';
import { getWalletFromPrivateKey } from './sol_utils';
import { SystemProgram } from '@solana/web3.js';
import { AddressLookupTableAccount } from '@solana/web3.js';
import { TransactionMessage } from '@solana/web3.js';
import { TransactionSignature } from '@solana/web3.js';
import bs58 from 'bs58'

const JITO_BLOCK_ENGINES = "frankfurt.mainnet.block-engine.jito.wtf"

const JITO_AUTH_KEYS = [
	"3vR9gCjrctfUpfegFxgxtSJrTHfv7HbFiqjjoMyCJnz3BaXsripHXYP7HQ4PNwqL48H8NqCYQuFGxD6SYo9W6Szy",
	"4EhHPoqXKxgWR9JZQz2Mjy7hPCtJzojL41g95GC5pSYeDnzFWGvqntk3vi51TAANYRPdMzfH13vP5eiCsqQsVvCh",
	"4EhHPoqXKxgWR9JZQz2Mjy7hPCtJzoobrjJfQ728B4UootzZgoUBh8eQVnC4EG6Hxkmyrdg8szd9J8CiK2kDimwS",
	"4EhHPoqXKxgWR9JZQz2Mjy7hPCtJzossfSwBiwrAXgQyV3uoKuQ7PMWXo8rHareFXDusT2Pf8vxqPxgnAzvPKyAv",
	"4EhHPoqXKxgWR9JZQz2Mjy7hPCtJzox9UAZi3ngCtJM941MrCxhQTktf7zWeCdXe1ekKmJ694WQEHFZGZr6AWhUG",
	"4EhHPoqXKxgWR9JZQz2Mjy7hPCtJzp2RGtCENdWFEvHJcztRXu6GWNXi1aHA9J7fXso4T89hrGzhpcUZmtqoAnrp",
]

const tipAccounts = [
	"96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5",
	"HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe",
	"Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY",
	"ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49",
	"DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh",
	"ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt",
	"DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL",
	"3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT"
].map(address => new PublicKey(address));

export const getRandomTipAccount = () => {
	return tipAccounts[Math.floor(Math.random() * tipAccounts.length)];
}

class JitoBundle {
	private engineURL: string = ""
	constructor(blockengineURL: string) {
		this.engineURL = blockengineURL
	}

	public sendBundle = async (connection: Connection, bundleTransactions: VersionedTransaction[], signers: Keypair[], tip: number, key: string) => {
		// const authKeypair = getWalletFromPrivateKey(key).keyPair
		const seacher = searcherClient(
			this.engineURL,
			// authKeypair
		);
		if (tip > 0) {
			let tipInstruction = SystemProgram.transfer({
				fromPubkey: signers[signers.length - 1].publicKey,
				toPubkey: getRandomTipAccount(),
				lamports: tip * LAMPORTS_PER_SOL,
			})
			let includedTipTx = bundleTransactions[bundleTransactions.length - 1]
			const addressLookupTableAccounts = await Promise.all(
				includedTipTx.message.addressTableLookups.map(async (lookup) => {
					return new AddressLookupTableAccount({
						key: lookup.accountKey,
						state: AddressLookupTableAccount.deserialize(await connection.getAccountInfo(lookup.accountKey).then((res: any) => res.data)),
					})
				}))
			let message = TransactionMessage.decompile(includedTipTx.message, { addressLookupTableAccounts: addressLookupTableAccounts })
			message.instructions.push(tipInstruction)
			includedTipTx.message = message.compileToV0Message(addressLookupTableAccounts)
			const recentBlockhash = (await connection.getLatestBlockhash())
			includedTipTx.message.recentBlockhash = recentBlockhash.blockhash
			includedTipTx.sign([signers[signers.length - 1]])
			bundleTransactions[bundleTransactions.length - 1] = includedTipTx
		}

		let signatures: Array<TransactionSignature> = []

		for (let tx of bundleTransactions) {
			for (let sg of tx.signatures) {
				signatures.push(bs58.encode(sg))
				break
			}
		}

		let transactionsConfirmResult: boolean = false
		let breakCheckTransactionStatus: boolean = false
		try {
			let bundleTx = new Bundle(bundleTransactions, bundleTransactions.length);

			seacher.onBundleResult(
				async (bundleResult: any) => {
					// console.log(bundleResult);

					if (bundleResult.rejected) {
						try {
							if (bundleResult.rejected.simulationFailure.msg.includes("custom program error") ||
								bundleResult.rejected.simulationFailure.msg.includes("Error processing Instruction")) {
								breakCheckTransactionStatus = true
							}
							else if (bundleResult.rejected.simulationFailure.msg.includes("This transaction has already been processed") ||
								bundleResult.rejected.droppedBundle.msg.includes("Bundle partially processed")) {
								transactionsConfirmResult = true
								breakCheckTransactionStatus = true
							}
						} catch (error) {

						}
					}
				},
				(error) => {
					// console.log("Bundle error:", error);
					breakCheckTransactionStatus = true
				}
			);
			await seacher.sendBundle(bundleTx);
			setTimeout(() => { breakCheckTransactionStatus = true }, 20000)
			const trxHash = signatures[0]
			while (!breakCheckTransactionStatus) {
				await sleep(500)
				try {
					const result = await connection.getSignatureStatus(trxHash, {
						searchTransactionHistory: true,
					});
					if (result && result.value && result.value.confirmationStatus) {
						transactionsConfirmResult = true
						breakCheckTransactionStatus = true
					}
				} catch (error) {
					transactionsConfirmResult = false
					breakCheckTransactionStatus = true
				}
			}
			if (transactionsConfirmResult) {
				console.log("Transaction confirmed", signatures)
				return signatures
			}
		} catch (error) {
			// console.error("Creating and sending bundle failed...", error);
			// await utils.sleep(10000)
		}
		return []
	}
}

export class JitoBundler {
	private bundler: any = null
	public constructor() {
		this.bundler = new JitoBundle(JITO_BLOCK_ENGINES)
	}

	private getJitoKey = (): string => {
		return JITO_AUTH_KEYS[Math.floor(Math.random() * JITO_AUTH_KEYS.length)]
	}

	public sendBundles = async (connection: Connection, bundleTransactions: VersionedTransaction[], signers: Keypair[] = [], tip: number = 0, maxRetry: number = 2): Promise<string[] | null> => {
		const len: number = bundleTransactions.length
		console.log("jito requesting ", len);

		if (!bundleTransactions.length || bundleTransactions.length > 5) {
			return null
		}

		const jitoBundle: JitoBundle = this.bundler

		const trxs = await jitoBundle.sendBundle(connection, bundleTransactions, signers, tip, this.getJitoKey())
		maxRetry--
		if (!trxs.length && maxRetry) {
			await sleep(500)
			return await this.sendBundles(connection, bundleTransactions, signers, tip, maxRetry)
		}
		return trxs
	}
}
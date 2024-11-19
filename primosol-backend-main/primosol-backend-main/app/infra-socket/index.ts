import { CONFIG, SOL_CONFIG } from "../config/config";
import { SocketIOClient } from "./socket_io";
import * as db from "../models"
import { LimitOrder_Trigger_Type, LimitOrderType } from "../interface";
import { swapToken } from "../utils/swap";
import { decryptPKey, fetchAPI } from "../utils/global_utils";
import { fetchTokenBalance, getTokenMetadata, getWalletFromPrivateKey, getWalletSOLBalance, updateSwapDb } from "../utils/sol_utils";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";

const ws_pool = new SocketIOClient(`${CONFIG.TOKEN_SOCKET_URL}/socket.io/tx`);

export const startLimitOrderByToken = async (mint: string) => {
    let priceInfo: any = await fetchAPI(`${CONFIG.TOKEN_API_URL}/token/price?baseMint=${mint}&quoteMint=${SOL_CONFIG.WSOL_ADDRESS}`, 'GET')
    if (priceInfo) {
        process(priceInfo.data)
    }
    const listeners = await db.getSocketListeners({ tokenAddress: mint })
    if (listeners && listeners.length > 0) {
        return;
    }
    ws_pool.sendMessage('subscribe',
        {
            type: 'PRICE_REALTIME',
            data: {
                address: mint,
                address_type: 'pair'
            },
        });
    let listenerId: number = ws_pool.registerListener('PRICE_REALTIME_DATA', data => {
        if (data.type === 'PRICE_REALTIME_DATA' && data.data) {
            process(data.data)
        }
    })
    await db.updateSocketListener({ tokenAddress: mint, listener_id: listenerId })
}

export const stopLimitOrderByToken = async (mint: string) => {
    let orders = await db.getLimitOrders({ tokenAddress: mint, status: 0 })
    if (orders && orders.length > 0) {
        return
    } else {
        const listeners: any = await db.getSocketListeners({ tokenAddress: mint })
        if (listeners && listeners.length > 0) {
            for (let listener of listeners) {
                ws_pool.removeListener(listener.listener_id)
            }
            await db.removeSocketListeners(({ tokenAddress: mint }))
        }
    }
}

export const process = async (data: any) => {
    if (data) {
        console.log(data)
        const mint = data.address;
        const price = data.price;
        const mcap = data.mcap;
        const orders: any = await db.getLimitOrderAggregate([
            {
                $match: {
                    tokenAddress: mint,
                    status: 0,
                },
            },
            {
                $lookup:
                {
                    from: "users",
                    localField: "wallet",
                    foreignField: "wallet",
                    as: "user",
                },
            },
            {
                $unwind:
                {
                    path: "$user",
                },
            }
        ])
        if (!orders && orders.length === 0) {
            return
        }
        const toTokenInfo = await getTokenMetadata(mint)
        if (!toTokenInfo) {
            return
        }
        let current_time = new Date().getTime()
        orders?.map(async (order: any) => {
            let dead_time = order.timeStamp + order.expire * 3600 * 1000
            if (current_time > dead_time) {
                db.updateLimitOrder({ _id: order._id }, { status: -1, comment: "order is expired" })
                return
            }
            if (order.order_type === LimitOrderType.BUY) {
                if ((order.trigger_type === LimitOrder_Trigger_Type.PRICE && order.target_price > price) ||
                    (order.trigger_type === LimitOrder_Trigger_Type.MC && order.target_mcap > mcap)) {
                    await db.updateLimitOrder({ _id: order._id }, { status: 3, triggeredAt: price, comment: "order is processing" })
                    console.log("buy processing")
                    const pkey = decryptPKey(order.user.deposit_pk)
                    const keyPair = getWalletFromPrivateKey(pkey).keyPair
                    const prev_toBalance = await fetchTokenBalance(order.user.deposit_wallet, mint, toTokenInfo.decimals)
                    const sol_balance = await getWalletSOLBalance(new PublicKey(order.user.deposit_wallet))
                    if (sol_balance / LAMPORTS_PER_SOL <= (order.amount + SOL_CONFIG.BASE_FEE / LAMPORTS_PER_SOL + order.trxPriority + order.amount * CONFIG.FEE / 100)) {
                        db.updateLimitOrder({ _id: order._id }, { status: -2, comment: "insufficient sol balance" })
                        return
                    }
                    swapToken(keyPair, SOL_CONFIG.WSOL_ADDRESS, mint, order.amount, order.slippage, order.trxPriority).then(async (trxId) => {
                        console.log("trxId", trxId)
                        if (trxId) {
                            updateSwapDb(order.user, SOL_CONFIG.WSOL_ADDRESS, order.amount, mint, toTokenInfo.decimals, prev_toBalance, trxId, order._id)
                            await db.updateLimitOrder({ _id: order._id }, { status: 2, trxId: trxId, comment: "buy successfully" })
                            stopLimitOrderByToken(mint)
                        } else {
                            if (order.retry > 0) {
                                db.updateLimitOrder({ _id: order._id }, { status: 0, retry: order.retry - 1, comment: "try again" })
                            } else {
                                db.updateLimitOrder({ _id: order._id }, { status: -2, comment: "Transaction failed" })
                            }
                        }
                    })
                }
            } else {
                if ((order.trigger_type === LimitOrder_Trigger_Type.PRICE && order.type === 1 && order.target_price > price) ||
                    (order.trigger_type === LimitOrder_Trigger_Type.MC && order.type === 1 && order.target_mcap > mcap) ||
                    (order.trigger_type === LimitOrder_Trigger_Type.PRICE && order.type === 0 && order.target_price < price) ||
                    (order.trigger_type === LimitOrder_Trigger_Type.MC && order.type === 0 && order.target_mcap < mcap)) {
                    await db.updateLimitOrder({ _id: order._id }, { status: 3, triggeredAt: price, comment: "order is processing" })
                    console.log("sell prcessing")
                    const pkey = decryptPKey(order.user.deposit_pk)
                    const keyPair = getWalletFromPrivateKey(pkey).keyPair
                    const tokenBalance = await fetchTokenBalance(order.user.deposit_wallet, mint, toTokenInfo.decimals)
                    const sol_balance = await getWalletSOLBalance(new PublicKey(order.user.deposit_wallet))
                    if ((tokenBalance === 0) || (/*order.amount_type === LimitOrder_Amount_Type.FIXED && */ order.amount >= tokenBalance)) {
                        db.updateLimitOrder({ _id: order._id }, { status: -2, comment: "insufficient token balance" })
                        return
                    }
                    if (sol_balance <= (SOL_CONFIG.BASE_FEE + order.trxPriority * LAMPORTS_PER_SOL)) {
                        db.updateLimitOrder({ _id: order._id }, { status: -2, comment: "insufficient sol balance" })
                        return
                    }
                    const prev_toBalance = sol_balance / LAMPORTS_PER_SOL
                    const amount = /*order.amount_type === LimitOrder_Amount_Type.FIXED ? */ order.amount;// : tokenBalance * order.amount / 100
                    swapToken(keyPair, mint, SOL_CONFIG.WSOL_ADDRESS, amount, order.slippage, order.trxPriority).then(async (trxId) => {
                        if (trxId) {
                            updateSwapDb(order.user, mint, amount, SOL_CONFIG.WSOL_ADDRESS, SOL_CONFIG.WSOL_DECIMALS, prev_toBalance, trxId, order._id)
                            await db.updateLimitOrder({ _id: order._id }, { status: 2, trxId: trxId, comment: "sell successfully" })
                            stopLimitOrderByToken(mint)
                        } else {
                            if (order.retry > 0) {
                                db.updateLimitOrder({ _id: order._id }, { status: 0, retry: order.retry - 1, comment: "try again" })
                            } else {
                                db.updateLimitOrder({ _id: order._id }, { status: -2, comment: "Transaction failed" })
                            }
                        }
                    })
                }
            }
        })
    }
}

export const start = async () => {
    const listeners = await db.getSocketListeners({})
    if (listeners && listeners.length > 0) {
        for (let listener of listeners) {
            ws_pool.sendMessage('subscribe',
                {
                    type: 'PRICE_REALTIME',
                    data: {
                        address: listener.tokenAddress,
                        address_type: 'pair'
                    },
                });
            let priceInfo: any = await fetchAPI(`${CONFIG.TOKEN_API_URL}/token/price?baseMint=${listener.tokenAddress}&quoteMint=${SOL_CONFIG.WSOL_ADDRESS}`, 'GET')
            if (priceInfo) {
                process(priceInfo.data)
            }
            let listenerId: number = ws_pool.registerListener('PRICE_REALTIME_DATA', data => {
                if (data.type === 'PRICE_REALTIME_DATA' && data.data) {
                    process(data.data)
                }
            })
            await db.updateSocketListener({ tokenAddress: listener.tokenAddress, listener_id: listenerId })
        }
    }
}
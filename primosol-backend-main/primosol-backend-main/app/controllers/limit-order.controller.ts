import { Request, Response } from 'express';
import { decryptPKey, sendResponse } from '../utils/global_utils';
import { sendTransaction, swapToken, transferFunds } from '../utils/swap';
import * as db from '../models';
import { fetchTokenBalance, getTokenMetadata, getWalletFromPrivateKey, updateSwapDb } from '../utils/sol_utils';
import { VersionedTransaction } from '@solana/web3.js';
import { start } from 'repl';
import { LimitOrderStatus, LimitOrderType } from '../interface';
import { startLimitOrderByToken, stopLimitOrderByToken } from '../infra-socket';

export const getLimitOrders = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        const user = await db.getUserById(userId);
        if (user) {
            let statusFilter = []
            const { skip, limit, filters } = req.body;
            if (filters) {
                if (filters.active) {
                    statusFilter.push({ status: 0 })
                }
                if (filters.failed) {
                    statusFilter.push({ status: -2 })
                }
                if (filters.success) {
                    statusFilter.push({ status: 2 })
                }
                if (filters.buyDip) {
                    statusFilter.push({ order_type: 0 })
                }
                if (filters.stopLoss) {
                    statusFilter.push({
                        $and: [
                            { order_type: 1 },
                            { type: 0 }
                        ]
                    })
                }
                if (filters.takeProfit) {
                    statusFilter.push({
                        $and: [
                            { order_type: 1 },
                            { type: 1 }
                        ]
                    })
                }
            }

            const matchCriteria: any = { wallet: user.wallet };
            if (statusFilter.length > 0) {
                matchCriteria.$or = statusFilter;
            }

            console.log("matchCriteria", matchCriteria)
            db.getLimitOrderAggregate([
                {
                    $match: matchCriteria
                },
                {
                    $sort:
                    {
                        timeStamp: 1,
                    }
                },
                {
                    $skip:
                        skip * limit,
                },
                {
                    $limit:
                        limit,
                },
                {
                    $project: {
                        order_id: "$_id",
                        _id: 0,
                        wallet: 1,
                        tokenAddress: 1,
                        symbol: 1,
                        logo: 1,
                        order_type: 1,
                        type: 1,
                        trigger_type: 1,
                        triggeredAt: 1,
                        created_price: 1,
                        created_mcap: 1,
                        target_price: 1,
                        target_mcap: 1,
                        amount: 1,
                        expire: 1,
                        slippage: 1,
                        trxPriority: 1,
                        status: 1,
                        trxId: 1,
                        comment: 1,
                        timeStamp: 1,
                    }
                }
            ]).then(data => {
                console.log("matchCriteria result", data)
                return sendResponse(
                    res,
                    200,
                    true,
                    { data: data ?? [] },
                    "getLimitOrders successfully"
                );
            })
        }
    } catch (error) {
        console.log(error)
        return sendResponse(res, 400, false, { error: "get limitorder" }, "order error");
    }
}
export const addLimitOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        const user = await db.getUserById(userId);
        if (user) {
            const { order_type, tokenAddress, symbol, logo, created_price, target_value, amount, expire, slippage, trxPriority, type, trigger_type } = req.body;
            const tokenInfo = await getTokenMetadata(tokenAddress)

            let params: db.ILimitOrder = {
                wallet: user.wallet,
                tokenAddress,
                symbol,
                logo,
                order_type,
                type,
                trigger_type,
                created_price,
                created_mcap: created_price * (tokenInfo?.totalSupply ?? 1_000_000_000),
                target_price: trigger_type === 0 ? target_value : target_value / (tokenInfo?.totalSupply ?? 1_000_000_000),
                target_mcap: trigger_type === 0 ? target_value * (tokenInfo?.totalSupply ?? 1_000_000_000) : target_value,
                amount,
                expire,
                slippage,
                trxPriority,
                status: LimitOrderStatus.PENDING, //pending
                timeStamp: Date.now()
            }
            const order = await db.addLimitOrder(params)
            startLimitOrderByToken(tokenAddress)
            return sendResponse(res, 200, true, { data: order }, "order successfully");
        }
    } catch (error) {
        console.error(error);
    }
    return sendResponse(res, 400, false, { error: "order error" }, "order error");
};

export const updateLimitOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        const user = await db.getUserById(userId);

        if (user) {
            const { order_id, target_value, target_price, amount, expire, slippage, status, trxPriority, type } = req.body;
            const order = await db.getLimitOrder({ _id: order_id })
            if (order) {
                const tokenInfo = await getTokenMetadata(order.tokenAddress)
                let params: db.ILimitOrder = {}
                if (user.wallet) params.wallet = user.wallet
                if (type != undefined) params.type = type
                if (target_value != undefined) {
                    params.target_price = order.trigger_type === 0 ? target_value : target_value / (tokenInfo?.totalSupply ?? 1_000_000_000)
                    params.target_mcap = order.trigger_type === 0 ? target_value * (tokenInfo?.totalSupply ?? 1_000_000_000) : target_value
                }
                if (target_price != undefined) {
                    params.target_price = target_price
                    params.target_mcap = target_price * (tokenInfo?.totalSupply ?? 1_000_000_000)
                }
                if (amount != undefined) params.amount = amount
                if (expire != undefined) params.expire = expire
                if (slippage != undefined) params.slippage = slippage
                if (trxPriority != undefined) params.trxPriority = trxPriority
                if (status != undefined) params.status = status
                await db.updateLimitOrder({ _id: order_id }, params)
                startLimitOrderByToken(order.tokenAddress)
                return sendResponse(res, 200, true, { data: order }, "order update successfully");
            }
        }
    } catch (error) {
        console.error(error);
    }
    return sendResponse(res, 400, false, { error: "order error" }, "order error");
};


export const removeLimitOrder = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        const user = await db.getUserById(userId);
        if (user) {
            const { order_id } = req.body;
            const order: any = await db.getLimitOrder({ _id: order_id })
            db.removeLimitOrder({ _id: order_id })
            stopLimitOrderByToken(order.tokenAddress)
            return sendResponse(res, 200, true, { data: order }, "order remove successfully");
        }
    } catch (error) {
        console.error(error);
    }
    return sendResponse(res, 400, false, { error: "order error" }, "order error");
};
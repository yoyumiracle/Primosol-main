import { Request, Response } from 'express';
import * as db from '../models'
import { sendResponse, validateUserUpdate } from '../utils/global_utils';
import { z } from 'zod';
import { getTokenMetadata, getWalletSOLBalance } from '../utils/sol_utils';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { SOL_CONFIG } from '../config/config';

export interface UserUpdateRequest {
    trxPriority: number;
}

const userUpdateSchema = z.object({
    trxPriority: z.number().positive()//.optional(),
});

export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        const user = await db.getUserById(userId)
        if (user) {
            const refcode = user.referralCode;
            db.getUsers({ referredBy: refcode }).then(async (refUsers) => {
                let refs = refUsers?.map(user => user.wallet)
                let userInfo: any = {};
                userInfo.wallet = user.wallet
                userInfo.referralCode = refcode;
                userInfo.refUsers = refs;
                userInfo.deposit_wallet = user.deposit_wallet;
                userInfo.expire_limit = user.expire_limit;
                userInfo.trxPriority = user.trxPriority;
                if (user.deposit_wallet) {
                    const sol_balance = await getWalletSOLBalance(new PublicKey(user.deposit_wallet))
                    userInfo.sol_balance = sol_balance / LAMPORTS_PER_SOL
                }
                return sendResponse(
                    res,
                    200,
                    true,
                    { data: userInfo },
                    "get user info success"
                );
            })
        }
    } catch (error) {
        console.log("getUserInfo", error)
        return sendResponse(
            res,
            400,
            false,
            { error: "userinfo error" },
            "get user info failed"
        );
    }
}

export const updateUserInfo = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        let user = await db.getUserById(userId)
        const validatedData = validateUserUpdate(userUpdateSchema, req)
        if (user && validatedData) {
            db.updateUser({ wallet: user.wallet }, validatedData).then(data => {
                return sendResponse(
                    res,
                    200,
                    true,
                    { data: data },
                    "update user info successfully"
                )
            })
        }
    } catch (error) {
        console.log(error)
        return sendResponse(
            res,
            400,
            false,
            { error: "update userinfo" },
            "update user info failed"
        );
    }
}

export const getTxData = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        let user = await db.getUserById(userId)
        let { filter, skip, limit } = req.body
        if (user && filter && skip !== undefined && limit) {
            let filterArray = []
            for (let item of filter) {
                filterArray.push({
                    'type': item
                })
            }
            db.getTrxAggregate([
                {
                    $match: {
                        wallet: user.wallet,
                        $or: filterArray
                    }
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
                
            ]).then(data => {
                return sendResponse(
                    res,
                    200,
                    true,
                    { data: data },
                    "getTxData success"
                )
            })
        }
    } catch (error) {
        console.log(error)
        return sendResponse(
            res,
            400,
            false,
            { error: "getTxData error" },
            "getTxData failed"
        );
    }
}

export const getHoldingTokens = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as any).id;
        let user = await db.getUserById(userId)
        if (user) {
            const filters = req.body
            const buyTokens = new Map<string, any>()
            const sellTokens = new Map<string, any>()
            let promiseAll = []
            //remainToken: boolean;
    // hidden: boolean;
            promiseAll.push(db.getTrxAggregate([
                {
                    $match: {
                        wallet: user.wallet,
                        type: 'swap',
                        fromMint: SOL_CONFIG.WSOL_ADDRESS,
                    }
                },
            ]).then(buyDatas => {
                if (buyDatas) {
                    for (let buyTx of buyDatas) {
                        if (buyTokens.get(buyTx.toMint)) {
                            let prev = buyTokens.get(buyTx.toMint)
                            prev.invest = prev.invest + buyTx.from_amount
                            prev.tokens = prev.tokens + buyTx.to_amount
                            buyTokens.set(buyTx.toMint, prev)
                        } else {
                            let data = {
                                mint: buyTx.toMint,
                                invest: buyTx.from_amount,
                                tokens: buyTx.to_amount
                            }
                            buyTokens.set(buyTx.toMint, data)
                        }
                    }
                }
            }))
            
            promiseAll.push(db.getTrxAggregate([
                {
                    $match: {
                        wallet: user.wallet,
                        type: 'swap',
                        toMint: SOL_CONFIG.WSOL_ADDRESS,
                    }
                },
            ]).then(sellDatas => {
                if (sellDatas) {
                    for (let sellTx of sellDatas) {
                        if (sellTokens.get(sellTx.fromMint)) {
                            let prev = sellTokens.get(sellTx.fromMint)
                            prev.tokens = prev.tokens + sellTx.from_amount
                            prev.sold = prev.sold + sellTx.to_amount
                            sellTokens.set(sellTx.fromMint, prev)
                        } else {
                            let data = {
                                mint: sellTx.fromMint,
                                tokens: sellTx.from_amount,
                                sold: sellTx.to_amount
                            }
                            sellTokens.set(sellTx.fromMint, data)
                        }
                    }
                }
            }))
            await Promise.all(promiseAll)
            Array.from(buyTokens.entries())
            let result = []
            for (let key of buyTokens.keys()) {
                const tokenInfo = await getTokenMetadata(key)
                let tokenData = {
                    mint: key,
                    symbol: tokenInfo?.symbol,
                    logo: tokenInfo?.logo,
                    invest: buyTokens.get(key).invest,
                    remain: buyTokens.get(key).tokens,
                    sold: 0,
                    pnl: -100
                }
                if (sellTokens.get(key)) {
                    tokenData.remain = buyTokens.get(key).tokens - sellTokens.get(key).tokens
                    tokenData.sold = sellTokens.get(key).sold
                    tokenData.pnl = (tokenData.sold - tokenData.invest) / tokenData.invest * 100
                }
                if (filters?.remainToken) {
                    if (tokenData.remain == 0) {
                        continue
                    }
                }
                result.push(tokenData)
            }
            return sendResponse(
                res,
                200,
                true,
                { data: result },
                "getHolding tokens success"
            )
        }
    } catch (error) {
        console.log(error)
        return sendResponse(
            res,
            400,
            false,
            { error: "getHolding error" },
            "getHolding failed"
        );
    }
}
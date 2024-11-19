import mongoose from 'mongoose'
import USER from './user.model'
import TRX from './trx.model'
import LIMIT_ORDER from './limitorder.model'
import SOCKET_LISTENER from './socketListener.model'
import { UserUpdateRequest } from '../controllers/user.controller'
mongoose.Promise = global.Promise
export const db = {
    mongoose: mongoose
}

export interface IUSER {
    id?: string,
    wallet?: string,
    admin?: number,
    referralCode?: string,
    referredBy?: string,
    referredTimestamp?: number,
    deposit_wallet?: string,
    deposit_pk?: string,
    trxPriority?: number,
}

interface ITRX {
    wallet: string,
    type: string,
    trxId: string,
    fromMint: string,
    from_amount: number,
    toMint: string,
    to_amount: number,
    orderbook_id?: string,
    timeStamp: number
}

export interface ILimitOrder {
    wallet?: string,
    tokenAddress?: string,
    symbol?: string,
    logo?: string,
    order_type?: number,
    type?: number,
    trigger_type?: number,
    triggeredAt?: number,
    created_price?: number,
    created_mcap?: number,
    target_price?: number,
    target_mcap?: number,
    amount?: number,
    amount_type?: number,
    expire?: number,
    slippage?: number,
    trxPriority?: number,
    status?: number,
    trxId?: string,
    comment?: string,
    timeStamp?: number,
    retry?: number,
}

export interface ISocketListener {
    tokenAddress: string,
    listener_id: number,
}
export const getUser = async (param: IUSER) => {
    try {
        return await USER.findOne(param)
    } catch (error) {
        console.log("getUserOne", error)
        return null
    }
}

export const getUsers = async (param: IUSER) => {
    try {
        return await USER.find(param)
    } catch (error) {
        console.log("getUsers", error)
        return null
    }
}

export const getUserById = async (id: string) => {
    try {
        return await USER.findById(id)
    } catch (error) {
        console.log("getUserById", error)
        return null
    }
}

export const addUser = async (param: IUSER) => {
    try {
        const user = new USER(param)
        await user.save();
        return user
    } catch (error) {
        console.log("addUser", error)
        return null
    }
}

export const updateUser = async (param: IUSER, content: UserUpdateRequest) => {
    try {
        return await USER.updateOne(param, { $set: content });
    } catch (error) {
        console.log("updateUser", error)
        return null
    }
}

export const addTrx = async (param: ITRX) => {
    try {
        const trx = new TRX(param)
        await trx.save();
        return trx
    } catch (error) {
        console.log("addTrx", error)
        return null
    }
}

export const getTrxAggregate = async (param: any) => {
    try {
        return await TRX.aggregate(param)
    } catch (error) {
        console.log("getUsers", error)
        return null
    }
}

export const addLimitOrder = async (param: ILimitOrder) => {
    try {
        const limitOrder = new LIMIT_ORDER(param)
        await limitOrder.save();
        return limitOrder
    } catch (error) {
        console.log("addBuyLimitOrder", error)
        return null
    }
}

export const getLimitOrder = async (param: any) => {
    try {
        return await LIMIT_ORDER.findOne(param)
    } catch (error) {
        console.log("getLimitOrders", error)
        return null
    }
}

export const getLimitOrders = async (param: any) => {
    try {
        return await LIMIT_ORDER.find(param)
    } catch (error) {
        console.log("getLimitOrders", error)
        return null
    }
}

export const getLimitOrderAggregate = async (param: any) => {
    try {
        return await LIMIT_ORDER.aggregate(param)
    } catch (error) {
        console.log("getLimitOrderAggregate", error)
        return null
    }
}

export const updateLimitOrder = async (param: any, content: ILimitOrder) => {
    try {
        return await LIMIT_ORDER.updateOne(param, { $set: content });
    } catch (error) {
        console.log("updateLimitOrder", error)
        return null
    }
}

export const removeLimitOrder = async (param: any) => {
    try {
        return await LIMIT_ORDER.deleteMany(param)
    } catch (error) {
        console.log("removeLimitOrder", error)
        return null
    }
}

export const updateSocketListener = async (param: ISocketListener) => {
    try {
        let listener = await SOCKET_LISTENER.findOne({ tokenAddress: param.tokenAddress })
        if (!listener) {
            listener = new SOCKET_LISTENER(param)
        }
        listener.listener_id = param.listener_id
        await listener.save();
        return listener
    } catch (error) {
        console.log("addSocketListener", error)
        return null
    }
}

export const getSocketListeners = async (param: any) => {
    try {
        return await SOCKET_LISTENER.find(param)
    } catch (error) {
        console.log("getSocketListener", error)
        return null
    }
}

export const removeSocketListeners = async (param: any) => {
    try {
        return await SOCKET_LISTENER.deleteMany(param)
    } catch (error) {
        console.log("removeSocketListeners", error)
        return null
    }
}
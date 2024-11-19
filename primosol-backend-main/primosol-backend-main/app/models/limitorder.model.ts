import mongoose from "mongoose";

const LIMITORDER = mongoose.model(
    "LimitOrder",
    new mongoose.Schema({
        wallet: { type: String, required: true },
        tokenAddress: { type: String, required: true },
        symbol: { type: String, required: true },
        logo: { type: String, required: true },
        order_type: { type: Number, required: true, default: 0 }, //0: buy, 1: sell
        type: { type: Number, default: 0 }, //0: TP, 1: SL
        trigger_type: { type: Number, required: true, default: 0 }, //0: price, 1: marketcap
        triggeredAt: { type: Number },
        created_price: { type: Number, required: true, default: 0 },
        created_mcap: { type: Number, required: true, default: 0 },
        target_price: { type: Number, required: true, default: 0 },
        target_mcap: { type: Number, required: true, default: 0 },
        amount: { type: Number, required: true, default: 0 },
        // amount_type: { type: Number, required: true, default: 0 }, //0: fixed amount 1: percent
        expire: { type: Number, required: true, default: 24 }, //hours
        slippage: { type: Number, required: true, default: 10 }, //%
        trxPriority: { type: Number, required: true, default: 0.0001 },
        status: { type: Number, required: true, default: 0 }, //-2: failed, -1: expired, 0: pending, 1: cancelled, 2: success
        trxId: { type: String },
        comment: { type: String }, //failed reason or others
        timeStamp: { type: Number, required: true },
        retry: { type: Number, required: true, default: 3}
    })
)

export default LIMITORDER
import mongoose from "mongoose";

const USER = mongoose.model(
    "User",
    new mongoose.Schema({
        wallet: { type: String, required: true},
        referralCode: { type: String, required: true},
        admin: { type: Number, required: true, default: 0 }, // 0:user, 1: admin: 2: dev
        referredBy: { type: String },
        referredTimestamp: { type: Number },
        deposit_wallet: { type: String },
        deposit_pk: { type: String },
        socket_id: { type: String },
        trxPriority: { type: Number, required: true, default: 0.0001 },
        expire_limit: { type: Number, required: true, default: 72 }, //hours
    })
)

export default USER
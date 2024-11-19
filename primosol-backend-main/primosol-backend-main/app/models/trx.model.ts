import mongoose from "mongoose";

const TRX = mongoose.model(
    "Transaction",
    new mongoose.Schema({
        wallet: { type: String, required: true},
        type: { type: String, required: true },//swap deposit, withdraw
        trxId: { type: String, required: true },
        fromMint: { type: String, required: true },
        from_amount: { type: Number, required: true },
        toMint: { type: String, required: true },
        to_amount: { type: Number, required: true },
        orderbook_id: { type: String },
        timeStamp: { type: Number, required: true },
    })
)

export default TRX
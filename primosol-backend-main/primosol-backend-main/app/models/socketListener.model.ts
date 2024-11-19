import mongoose from "mongoose";

const SOCKET_LISTENER = mongoose.model(
    "SocketListener",
    new mongoose.Schema({
        tokenAddress: { type: String, required: true},
        listener_id: { type: Number, required: true},
    })
)

export default SOCKET_LISTENER
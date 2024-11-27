import mongoose from "mongoose";

const messagechema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    content: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export const Message = mongoose.model("Message", messagechema);
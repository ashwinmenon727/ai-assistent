import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({

    userId: String,

    message: String,

    reply: String,

    createdAt: {
        type: Date,
        default: Date.now
    }

});

export default mongoose.model("Chat", ChatSchema);
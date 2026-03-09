import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+\-]+@gmail\.com$/, "Only Gmail addresses are allowed"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters"]
    },

    plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free"
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    lastLogin: {
        type: Date
    }

});

export default mongoose.model("User", UserSchema);

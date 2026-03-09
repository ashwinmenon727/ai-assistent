import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";

const app = express();

app.use(cors());
app.use(express.json());

/* MongoDB connection */

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

/* Routes */

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

/* Server */

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

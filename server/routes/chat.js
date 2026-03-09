import express from "express";
import Groq from "groq-sdk";
import Chat from "../models/Chat.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const router = express.Router();

/* Multer config — store uploads temporarily */
const upload = multer({
    dest: "uploads/",
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
});

/* Lazy Groq client */
let groq;
const getGroq = () => {
    if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    return groq;
};

/* Helper: get auth userId from request */
const getUserId = async (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
    try {
        const { default: jwt } = await import("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch {
        return null;
    }
};

/* Helper: build content array for Groq from file + message */
const buildContent = async (file, message) => {
    const content = [];

    if (file) {
        const mimeType = file.mimetype;
        const filePath = file.path;

        if (mimeType.startsWith("image/")) {
            // Images: send as base64 (works with vision-capable models)
            const imageData = fs.readFileSync(filePath).toString("base64");
            content.push({
                type: "text",
                text: `[The user has shared an image: ${file.originalname}. Describe and analyze it based on the user's message.]`
            });
            // Note: Groq/Llama vision support — include base64 as text context
            content.push({
                type: "text",
                text: `Image data (base64): data:${mimeType};base64,${imageData}`
            });

        } else if (mimeType === "application/pdf") {
            // PDF: extract text
            try {
                const dataBuffer = fs.readFileSync(filePath);
                const pdfData = await pdfParse(dataBuffer);
                content.push({
                    type: "text",
                    text: `[PDF Document: "${file.originalname}"]\n\n${pdfData.text}`
                });
            } catch {
                content.push({ type: "text", text: `[Could not parse PDF: ${file.originalname}]` });
            }

        } else if (mimeType.startsWith("audio/")) {
            // Audio: transcribe using Groq Whisper
            try {
                const transcription = await getGroq().audio.transcriptions.create({
                    file: fs.createReadStream(filePath),
                    model: "whisper-large-v3",
                });
                content.push({
                    type: "text",
                    text: `[Audio transcription of "${file.originalname}"]:\n\n${transcription.text}`
                });
            } catch {
                content.push({ type: "text", text: `[Could not transcribe audio: ${file.originalname}]` });
            }

        } else if (mimeType.startsWith("video/")) {
            // Video: extract audio and transcribe
            content.push({
                type: "text",
                text: `[Video file uploaded: "${file.originalname}". Note: Only audio transcription is supported for video. Please extract audio first for best results.]`
            });
        }

        // Clean up temp file after reading
        try { fs.unlinkSync(filePath); } catch { }
    }

    if (message?.trim()) {
        content.push({ type: "text", text: message });
    }

    return content;
};

/* ── TEXT-ONLY CHAT (existing route, unchanged) ── */
router.post("/", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message?.trim()) return res.status(400).json({ error: "Message is required" });

        const userId = await getUserId(req);

        const completion = await getGroq().chat.completions.create({
            messages: [{ role: "user", content: message }],
            model: "llama-3.3-70b-versatile"
        });

        const reply = completion.choices[0].message.content;

        if (userId) {
            const chat = new Chat({ userId, message, reply });
            await chat.save();
        }

        res.json({ reply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "AI request failed" });
    }
});

/* ── FILE + MESSAGE ROUTE ── */
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const { message } = req.body;
        const file = req.file;

        if (!file && !message?.trim()) {
            return res.status(400).json({ error: "Message or file is required" });
        }

        const userId = await getUserId(req);
        const content = await buildContent(file, message);

        // Groq content can be string or array
        const completion = await getGroq().chat.completions.create({
            messages: [{
                role: "user",
                content: content.length === 1 ? content[0].text : content.map(c => c.text).join("\n\n")
            }],
            model: "llama-3.3-70b-versatile"
        });

        const reply = completion.choices[0].message.content;
        const displayMessage = message || `[File: ${file?.originalname}]`;

        if (userId) {
            const chat = new Chat({ userId, message: displayMessage, reply });
            await chat.save();
        }

        res.json({ reply });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "AI request failed" });
    }
});

export default router;

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/* ── Validation helpers ── */
const isValidGmail = (email) => {
    const trimmed = email.trim().toLowerCase();
    // Must be a valid email format AND end with @gmail.com
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@gmail\.com$/;
    return emailRegex.test(trimmed);
};

const getPasswordStrength = (password) => {
    const issues = [];
    if (password.length < 8) issues.push("at least 8 characters");
    if (!/[A-Z]/.test(password)) issues.push("one uppercase letter");
    if (!/[a-z]/.test(password)) issues.push("one lowercase letter");
    if (!/[0-9]/.test(password)) issues.push("one number");
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password))
        issues.push("one special character (!@#$%^&* etc.)");
    return issues;
};

/* ── Rate limiting (simple in-memory) ── */
const loginAttempts = new Map();

const checkRateLimit = (ip) => {
    const now = Date.now();
    const record = loginAttempts.get(ip) || { count: 0, resetAt: now + 15 * 60 * 1000 };
    if (now > record.resetAt) {
        record.count = 0;
        record.resetAt = now + 15 * 60 * 1000;
    }
    record.count++;
    loginAttempts.set(ip, record);
    return record.count;
};

/* ── REGISTER ── */
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check fields exist
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Validate Gmail
        if (!isValidGmail(email)) {
            return res.status(400).json({ message: "Only Gmail addresses are allowed (e.g. you@gmail.com)." });
        }

        // Validate password strength
        const issues = getPasswordStrength(password);
        if (issues.length > 0) {
            return res.status(400).json({
                message: `Password must contain: ${issues.join(", ")}.`
            });
        }

        // Check if user already exists
        const existing = await User.findOne({ email: email.trim().toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: "An account with this email already exists." });
        }

        // Hash password with strong salt
        const hashed = await bcrypt.hash(password, 12);

        const user = new User({
            email: email.trim().toLowerCase(),
            password: hashed
        });

        await user.save();

        res.status(201).json({ message: "Account created successfully. Please sign in." });

    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Registration failed. Please try again." });
    }
});

/* ── LOGIN ── */
router.post("/login", async (req, res) => {
    try {
        const ip = req.ip || req.connection.remoteAddress;
        const attempts = checkRateLimit(ip);

        // Block after 10 failed attempts in 15 min
        if (attempts > 10) {
            return res.status(429).json({ message: "Too many login attempts. Please wait 15 minutes." });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        if (!isValidGmail(email)) {
            return res.status(400).json({ message: "Only Gmail addresses are allowed." });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });

        // Use same error for both "no user" and "wrong password" to prevent user enumeration
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Reset rate limit on success
        loginAttempts.delete(ip);

        // Sign token with expiry
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: { email: user.email, plan: user.plan }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
});

export default router;

import express from "express";
import http from "http";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import { setupSocket } from "./lib/socket.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173", // 🔁 Update this to your frontend URL on Render/Netlify
		credentials: true,
	})
);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Serve static frontend in production
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/dist")));
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
	});
}

// ✅ Socket.io Setup (only once, using same server)
setupSocket(server);

// ✅ Start Server
server.listen(PORT, () => {
	console.log("✅ Server running on port:", PORT);
	connectDB();
});

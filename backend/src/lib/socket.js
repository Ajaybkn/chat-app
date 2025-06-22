import { Server } from "socket.io";

const userSocketMap = {};
let io;

export function setupSocket(server) {
	io = new Server(server, {
		cors: {
			origin: ["http://localhost:5173"], // replace in prod
			credentials: true,
		},
	});

	io.on("connection", (socket) => {
		const userId = socket.handshake.query.userId;
		if (userId) userSocketMap[userId] = socket.id;

		io.emit("getOnlineUsers", Object.keys(userSocketMap));

		socket.on("disconnect", () => {
			delete userSocketMap[userId];
			io.emit("getOnlineUsers", Object.keys(userSocketMap));
		});
	});
}

export function getReceiverSocketId(userId) {
	return userSocketMap[userId];
}

export function getIO() {
	return io;
}

import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

export const socket = io(API_URL, {
  transports: ["websocket"],
  autoConnect: true
});

// Khi kết nối → join vào admin room
socket.on("connect", () => {
  console.log("Admin FE connected:", socket.id);
  socket.emit("joinAdmin");
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

export default socket;

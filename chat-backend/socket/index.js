const { Server } = require("socket.io");
const { handleSocket } = require("./handleSocket");


let io;
const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);
        handleSocket(io, socket)
    });

    return io;
};

module.exports = { initSocket };
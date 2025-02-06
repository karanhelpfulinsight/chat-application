const {Server} = require("socket.io")
const {handleSocket}  = require("./handler")

let io;
const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    io.on("connection", (socket) => {
        console.log(socket._id)
        handler(io, socket)
    })

    return io;
}

module.exports = {initSocket}


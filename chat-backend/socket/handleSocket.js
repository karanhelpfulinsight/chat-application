const User = require("../models/userModel")
const Chat = require("../models/chatModel")
const Message = require("../models/messageModel")

const handleSocket = (io, socket) => {
    let currentUserId = null

    socket.on("setup", async (id) => {
        currentUserId = id
        socket.join(id)
        socket.emit("user setup", id)
        await User.findByIdAndUpdate(id, { isOnline: true })
    })

    socket.on("join-chat", async (data) => {
        const { chatId, userId } = data
        socket.join(chatId)
        io.to(chatId).emit("user-joined-room", userId)
    })

    socket.on("leave-chat", (chatId) => {
        socket.leave(chatId)
    })

    socket.on("send-message", async (data) => {
        try {
            const { chat, sender, content } = data

            // Create and save the message in the database
            const message = await Message.create({
                sender,
                content,
                chat
            })

            const populatedMessage = await message.populate("sender", "-password")

            // Update the chat's lastMessage
            await Chat.findByIdAndUpdate(chat, {
                lastMessage: message._id
            })

            // Send the message to all users in the chat room
            io.to(chat).emit("receive-message", populatedMessage)

            // Send notification to offline users
            const currentChat = await Chat.findById(chat)
            const receiverId = currentChat.users.find(
                id => id.toString() !== sender.toString()
            )
            
            if (!io.sockets.adapter.rooms.get(chat)?.has(receiverId.toString())) {
                io.to(receiverId.toString()).emit(
                    "new-message-notification",
                    populatedMessage
                )
            }
        } catch (error) {
            console.error("Error sending message:", error)
            socket.emit("message-error", { error: "Failed to send message" })
        }
    })

    socket.on("typing", (data) => {
        io.to(data.chat).emit("typing", data)
    })

    socket.on("stop-typing", (data) => {
        io.to(data.chatId).emit("stop-typing", data)
    })

    socket.on("disconnect", async () => {
        try {
            await User.findByIdAndUpdate(currentUserId, {
                isOnline: false,
                lastSeen: new Date()
            })

            const currentChats = await Chat.find({
                users: { $in: [currentUserId] }
            })

            currentChats.forEach((chat) => {
                const sock = io.sockets.adapter.rooms.get(chat?._id)
                if (sock) {
                    io.to(chat?._id).emit("user-left-room", {})
                }
            })
        } catch (error) {
            console.log("Disconnect error:", error)
        }
    })
}

module.exports = { handleSocket }
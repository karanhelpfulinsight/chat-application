const User = require("../models/userModel")
const Chat = require("../models/chatModel")
const Message = require("../models/messageModel")

const handleSocket = (io, socket) => {
    let currentUserId = null

    socket.on("setup", async (id) => {
        currentUserId = id;
        socket.join(id);
        socket.emit("user setup", id);
        await User.findByIdAndUpdate(id, { 
            isOnline: true,
            lastSeen: new Date()
        });
        io.emit("user-status-change", {
            userId: id,
            isOnline: true
        });
    });

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
            const message = await Message.create({
                sender,
                content,
                chat
            })

            const populatedMessage = await message.populate("sender", "-password")

            await Chat.findByIdAndUpdate(chat, {
                lastMessage: message._id
            })

            io.to(chat).emit("receive-message", populatedMessage)

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
        if (!data.chat) return;
        io.to(data.chat).emit("typing", data)
    })

    socket.on("stop-typing", (data) => {
        if (!data.chat) return;
        io.to(data.chat).emit("stop-typing", data)
    })

    socket.on("disconnect", async () => {
        try {
            if (!currentUserId) return;
            
            const lastSeen = new Date();
            await User.findByIdAndUpdate(currentUserId, {
                isOnline: false,
                lastSeen
            });

            io.emit("user-status-change", {
                userId: currentUserId,
                isOnline: false,
                lastSeen
            });

            const currentChats = await Chat.find({
                users: { $in: [currentUserId] }
            });

            currentChats.forEach((chat) => {
                const sock = io.sockets.adapter.rooms.get(chat?._id);
                if (sock) {
                    io.to(chat?._id).emit("user-left-room", {
                        userId: currentUserId,
                        lastSeen
                    });
                }
            });
        } catch (error) {
            console.log("Disconnect error:", error);
        }
    });
}

module.exports = { handleSocket }
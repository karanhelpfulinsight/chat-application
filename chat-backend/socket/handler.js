const User = require("../models/userModel")
const Chat = require("../models/chatModel")
const handleSocket = (io, socket) => {
    let currentUserId = null;

    socket.on("setup", async (id) => {
        currentUserId = id;
        socket.join(id)
        socket.emit("user setup", id);

        await User.findByIdAndUpdate(id, { isOnline: true });

    })

    socket.on("join-chat", async (data) => {
        const { chatId, userId } = data;
        const conv = await Chat.findById(chatId)

        socket.join(chatId);
        io.to(chatId).emit("user-joined-room", userId)
    })

    socket.on("leav-chat", (chat) => {
        socket.leave(chat)
    })

    socket.on("send-message", async (data) => {
        const { chat, sender, content } = data;

        const currentChat = await Chat.findById({ _id: chat }).populate("users", "-password")

        const receiverId = currentChat.users.find(user => user._id !== sender)._id
        const receiverPersonalChat = io.sockets.adapter.rooms.get(receiverId.toString())
        const receiverPersonalRoom = io.sockets.adapter.rooms.get(
            receiverId.toString()
        );

        let isReceiverInsideChatRoom = false;

        if (receiverPersonalRoom) {
            const receiverSid = Array.from(receiverPersonalRoom)[0];
            isReceiverInsideChatRoom = io.sockets.adapter.rooms
                .get(conversationId)
                .has(receiverSid);
        }

        const message = await sendMessageHandler({
            chat, sender, content,
            receiverId,
            isReceiverInsideChatRoom,
        });

        io.to(chat).emit("receive-message", message);
        if (!isReceiverInsideChatRoom) {
            console.log("Emitting new message to: ", receiverId.toString());
            io.to(receiverId.toString()).emit("new-message-notification", message);
        }
    })

    // Typing indicator
    socket.on("typing", (data) => {
        io.to(data.chat).emit("typing", data);
    });

    // Stop typing indicator
    socket.on("stop-typing", (data) => {
        io.to(data.chatId).emit("stop-typing", data);
    });

    socket.on("disconnect", async() => {
        try {
            await User.findByIdAndUpdate(currentUserId, {
                isOnline: false,
                lastSeen: new Date(),
            })
        }catch(error) {
            console.log("this is error: ", error)
        }

        const currentChat = await Chat.find({
            users: {$in: [currentUserId]}
        })

        currentChat.forEach((chat) => {
            const sock = io.sockets.adapter.rooms.get(chat?._id)
            if(sock) {
                io.to(chat?._id).emit("user-left-room", {})
            }
        })
    })

}

module.exports = { handleSocket };
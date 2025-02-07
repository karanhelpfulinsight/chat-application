const Chat = require("../models/chatModel");
const Message = require("../models/messageModel")

const sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;
        const getChat = await Chat.findOne({ _id: chatId })

        if (!getChat) {
            return res.status(404).json({
                message: "Chat not found",
                data: {}
            })
        }

        const newMessage = new Message({
            sender: req.user._id,
            content,
            chat: chatId
        });

        let message = await Message.create(newMessage);
        message = await message
            .populate("sender", "name email")
        message = await message.populate({
            path: "chat",
            populate: {
                path: "users",
                select: "name email"
            }
        })
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message })

        return res.status(201).json({
            message: "Message sent successfully",
            data: message
        })

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            data: {}
        })
    }
}

const senderMessage = async (data) => {
    const { content, sender, chat, receiverId,
        isReceiverInsideChatRoom, } = data;

    const currentChat = await Chat.findById({ _id: chat });
    const message = await Message.create({
        sender, chat, content, readBy: []
    })

    if (isReceiverInsideChatRoom) {
        message.readBy = [{
            user: receiverId,
            seenAt: new Date()
        }]

        await message.save();

    }
    currentChat.latestMessage = message;
    await currentChat.save();
    return message
}
const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name email")
            .populate("chat");
        return res.status(200).json({
            data: messages,
            message: "Messages retrieved successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            data: {},
        })
    }
};

const getAllMessageByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User id is required', data: []});
        }
        let chat = await Chat.findOne({
            $and: [
                {
                    users: { $elemMatch: { $eq: req.user._id } }
                },
                {
                    users: { $elemMatch: { $eq: userId } }
                }
            ]
        })

        if(!chat) {
            return res.status(404).json({message: "message not found", data:[]})
        }
        let messages = await Message.find({ chat: chat._id })
        if(!messages) {
            return res.status(404).json({message: "No messages found", data:[]})
        }

        return res.status(200).json({ message: "Messages retrieved successfully", data: messages });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server Error' });
    }
}
module.exports = { sendMessage, allMessages, getAllMessageByUserId,sendMessage  }
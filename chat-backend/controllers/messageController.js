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
            .populate("sender", "name")
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
module.exports = { sendMessage, allMessages }
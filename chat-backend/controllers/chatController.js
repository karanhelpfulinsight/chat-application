const Chat = require("../models/chatModel")

const accessChat = async (req, res) => {
    const {userId} = req.params;
    if(!userId) {
        return res.status(403).json({message:"User Id not passed", data: {}});
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", "-password")
        .populate({
            path: "latestMessage",
            populate: {
              path: "sender",
              select: "name email",
            },
          });
    
      if (isChat.length > 0) {
        return res.status(200).json({
            message: "Chat found successfully",
            data: isChat[0],
        })
      } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };
      
          try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
              "users",
              "-password"
            );
            return res.status(201).json({
                message: "Chat created successfully",
                data: FullChat,
            })
          } catch (error) {
            
          }
      }
    
}

const fetchAllChat = async (req, res) => {
    try {
        let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate({
                path: "latestMessage",
                populate: {
                    path: "sender",
                    select: "name email",
                },
            })
            .sort({ updatedAt: -1 });
    
        res.status(200).json({
            message: "Chat fetched successfully",
            data: chats,
        })
        
    }catch(err) {
        return res.status(500).json({
            message: "Failed to fetch chat",
            data: {},
            error: err.message
        })
    }
}


module.exports = {accessChat, fetchAllChat}
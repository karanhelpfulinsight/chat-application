import { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { debounce } from "lodash"
import api from "../axios/api"
import socket from "../socket"
import { setSelectedChat } from "../redux/slices/chatSlice"
import Sidebar from "../components/SideBar"
import ChatWindow from "../components/ChatWindow"

export default function WhatsAppClone() {
  const dispatch = useDispatch();
  const { selectedChat } = useSelector((state) => state.chat)
  const [chatData, setChatData] = useState([])
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const user = JSON.parse(sessionStorage.getItem("user"))

  const fetchAllChats = async (query) => {
    try {
      let chatUsers = []
      if (query) {
        const { data: users } = await api.get(`/user/search?query=${query}`)
        chatUsers = users.data.map((user) => ({
          ...user,
          chatId: user?._id
        }))
      } else {
        const { data: chats } = await api.get("/chat/all")
        chatUsers = chats?.data.map((chat) => {
          return {
            ...chat.users.find((item) => item?._id !== user?._id),
            chatId: chat?._id
          }
        })
      }
      setChatData(chatUsers)
    } catch (error) {
      console.error("Error fetching chats:", error)
    }
  }

  const debouncedFetchChats = useCallback(debounce(fetchAllChats, 500), [])

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("Connected to socket server with ID:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("user-status-change", ({ userId, isOnline, lastSeen }) => {
      setChatData(prev => prev.map(chat => {
        if (chat._id === userId) {
          return { ...chat, isOnline, lastSeen };
        }
        return chat;
      }));
      
      console.log({
        ...selectedChat,
        users: selectedChat?.users?.map(u => {
          if (u._id === userId) {
            return { ...u, isOnline, lastSeen };
          }
          return u;
        })
      }, selectedChat, "onUpdate")
      if (selectedChat.users) {
       
        dispatch(setSelectedChat({
          ...selectedChat,
          users: selectedChat?.users?.map(u => {
            if (u._id === userId) {
              return { ...u, isOnline, lastSeen };
            }
            return u;
          })
        }));
      }
    });

    if (user) {
      socket.emit("setup", user._id);
    }

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("user-status-change");
      socket.disconnect();
    };
  }, [])

  useEffect(() => {
    if (user) {
      debouncedFetchChats(searchTerm)
    }
  }, [searchTerm])

  useEffect(() => {
    const accessChat = async () => {
      try {
        let res = {}
        if (searchTerm !== "") {
          res = await api.get(`chat/user/${selectedChatId}`)
        } else {
          res = await api.get(`chat/${selectedChatId}`)
        }
        dispatch(setSelectedChat(res?.data?.data))
        if (res?.data?.data?._id) {
          socket.emit("join-chat", {
            chatId: res.data.data._id,
            userId: user._id
          })
        }
      } catch (err) {
        console.error("Error accessing chat:", err)
      }
    }
    if (selectedChatId != null) {
      accessChat()
    }

    return () => {
      if (selectedChat?._id) {
        socket.emit("leave-chat", selectedChat._id);
      }
    };
  }, [selectedChatId])

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const { data: messageData } = await api.get(`message/${selectedChat?._id}`)
        setMessages(messageData.data || [])
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    if (selectedChat?._id) {
      fetchAllMessages()
    }
  }, [selectedChat])

  const sendMessage = (messageText) => {
    if (messageText.trim() === "" || !selectedChat?._id) return

    const messageData = {
      chat: selectedChat._id,
      sender: user._id,
      content: messageText
    }

    socket.emit("send-message", messageData)
  }

  const handleTyping = (isTyping) => {
    if (!selectedChat?._id) return;

    socket.emit(isTyping ? "typing" : "stop-typing", {
      chat: selectedChat._id,
      userId: user._id
    });
  };

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(
          (msg) => msg._id === message._id || 
          (msg.content === message.content && 
           msg.sender._id === message.sender._id &&
           !msg._id)
        )
        if (messageExists) return prevMessages
        return [...prevMessages, message]
      })
    })

    socket.on("typing", (data) => {
      if (data.chat === selectedChat?._id && data.userId !== user._id) {
        setIsTyping(true);
      }
    });
  
    socket.on("stop-typing", (data) => {
      if (data.chat === selectedChat?._id && data.userId !== user._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off("receive-message")
      socket.off("typing");
      socket.off("stop-typing");
    }
  }, [selectedChat])

  
  useEffect(() => {
    console.log(selectedChat, isTyping, "typeing....")
  },[isTyping])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        chats={chatData}
        onChatSelect={setSelectedChatId}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <ChatWindow
        selectedChat={selectedChat}
        messages={messages}
        onSendMessage={sendMessage}
        isTyping={isTyping}
        onTyping={handleTyping}
      />
    </div>
  )
}
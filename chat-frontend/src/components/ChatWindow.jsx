import { useEffect, useState, useRef } from "react";

export default function ChatWindow({ selectedChat, messages, onSendMessage, isTyping, onTyping }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (selectedChat?._id) {
        onTyping(false);
      }
    };
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (messageText.trim() === "" || !selectedChat?._id) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    onTyping(false);

    onSendMessage(messageText);
    setMessageText("");
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setMessageText(newText);
    if (!selectedChat?._id) return;
  
    if (newText.trim() === "") {
      onTyping(false);
      return;
    }
  
    onTyping(true);
  
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 5000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  console.log(selectedChat, "chatWindow")
  const otherUser = selectedChat?.users?.find(u => u._id !== user?._id);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="border-b p-4 flex items-center">
        {
          otherUser?.name && <div className="w-8 h-8 bg-gray-300 rounded-full mr-2"></div>
        }
        
        <div className="flex items-center space-x-2">
          <span className="font-medium">{otherUser?.name}</span>
          {isTyping && (
          <span className="text-sm text-gray-500 ml-2">typing...</span>
        )}
        </div>
        
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message._id || index}
            className={`flex ${
              message.sender._id === user?._id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender._id === user?._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <p className="text-gray-500">typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <textarea
            value={messageText}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
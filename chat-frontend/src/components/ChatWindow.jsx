import { useEffect, useState, useRef } from "react";

export default function ChatWindow({ selectedChat, messages, onSendMessage, isTyping, onTyping }) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  console.log(isTyping, "when typ")

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTyping(false);
    };
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (messageText.trim() === "") return;

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
    }, 3000);
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-500">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-gray-200 p-4 flex items-center">
        <div className="w-10 h-10 bg-gray-300 rounded-full mr-4"></div>
        <div className="flex flex-col">
          <h2 className="font-semibold">
            {selectedChat?.users.find((item) => item._id !== user?._id)?.name}
          </h2>

          {isTyping && <span className="text-sm text-gray-500">typing...</span>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((message, index) => (
          <div 
            key={message._id || `temp-${index}`} 
            className={`mb-4 ${
              message.sender._id === user?._id ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender._id === user?._id 
                  ? "bg-green-200 text-green-900" 
                  : "bg-white text-gray-900"
              }`}
            >
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="bg-gray-200 p-4 flex items-center">
        <input
          type="text"
          value={messageText}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded mr-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

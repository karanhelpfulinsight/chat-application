const ChatItem = ({ chat, onSelect }) => {
  return (
    <div 
      className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-100" 
      onClick={onSelect}
    >
      <div className="relative">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        {chat.isOnline && (
          <div className="absolute bottom-0 right-4">
            <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold">{chat.name}</h3>
        </div>
        {!chat.isOnline && chat.lastSeen && (
          <p className="text-xs text-gray-500">
            Last seen: {new Date(chat.lastSeen).toLocaleString()}
          </p>
        )}
        <p className="text-sm text-gray-600">{chat.lastMessage ?? ""}</p>
      </div>
      <span className="text-xs text-gray-500">{chat.timestamp ?? ""}</span>
    </div>
  );
};

export default ChatItem
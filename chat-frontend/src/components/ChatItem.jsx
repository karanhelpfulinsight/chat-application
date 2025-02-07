const ChatItem = ({ chat, onSelect }) => {
    return (
      <div className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-100" onClick={onSelect}>
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        <div className="flex-1">
          <h3 className="font-semibold">{chat.name}</h3>
          <p className="text-sm text-gray-600">{chat.lastMessage?? ""}</p>
        </div>
        <span className="text-xs text-gray-500">{chat.timestamp ?? ""}</span>
      </div>
    )
  }

export default ChatItem
  
  
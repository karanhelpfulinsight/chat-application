import ChatItem from "./ChatItem"
export default function ChatList({ chats, onChatSelect }) {
  return (
    <div className="overflow-y-auto h-[calc(100vh-68px)]">
      {chats.map((chat) => (
        <ChatItem key={chat._id} chat={chat} onSelect={() => onChatSelect(chat.chatId)} />
      ))}
    </div>
  )
}


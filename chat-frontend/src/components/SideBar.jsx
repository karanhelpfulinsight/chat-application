
import SearchBar from "./SearchBar"
import ChatList from "./ChatList"
export default function Sidebar({ chats, onChatSelect, searchTerm, onSearchChange }) {
  return (
    <div className="w-1/3 bg-white border-r">
      <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} />
      <ChatList chats={chats} onChatSelect={onChatSelect} />
    </div>
  )
}


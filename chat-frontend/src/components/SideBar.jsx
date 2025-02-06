import ChatList from "./ChatList";
import SearchBar from "./SearchBar";


export default function Sidebar({ chats, onChatSelect, searchTerm, onSearchChange }) {
  return (
    <div className="w-1/3 bg-white border-r">
      <SearchBar />
      <ChatList />
    </div>
  )
}


export default function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="p-4 bg-gray-200">
      <input
        type="text"
        placeholder="Search or start new chat"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full p-2 rounded-lg"
      />
    </div>
  )
}


import { IoSearchOutline } from "react-icons/io5";

const SearchBar = () => (
  <div className="relative w-full px-4 py-2">
    <IoSearchOutline className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
    <input
      type="text"
      placeholder="Search"
      className="w-full bg-gray-900 rounded-full py-2 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-primary"
    />
  </div>
);

export default SearchBar;

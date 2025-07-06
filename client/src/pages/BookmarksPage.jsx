import { IoMdArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";
import PostComponent from "../components/PostComponent";
import usePostStore from "../../store/usePostStore.js";
import InfiniteScroll from "react-infinite-scroll-component";
import useBookmarkStore from "../../store/useBookmarkStore.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.jsx";
import { useEffect } from "react";
import Loader from "../components/Loader.jsx";

const BookmarksPage = () => {
  const {
    activeTab,
    setActiveTab,
    isLoading,
    error,
    fetchBookmarks,
    bookmarks,
    hasMore,
  } = useBookmarkStore();

  const axiosPrivate = useAxiosPrivate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setActiveTab("bookmarks");
  }, []);

  useEffect(() => {
    fetchBookmarks(axiosPrivate);
  }, [bookmarks]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center w-full space-y-5">
          {/* Header */}
          <div className="flex justify-start w-full items-center gap-10 ">
            <Link to="/">
              <IoMdArrowBack className="text-2xl font-bold " />
            </Link>
            <h2 className="text-xl font-semibold">Bookmarks</h2>
          </div>
          {/* Search */}
          <div className="flex justify-around items-center w-full">
            <label className="input bg-black rounded-2xl w-full">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" required placeholder="Search Bookmarks" />
            </label>
          </div>
          <div className="grid grid-cols-2 border-b border-gray-800 w-full">
            <div
              className={`text-center py-3 hover:bg-gray-900 transition-colors ${
                activeTab === "bookmarks"
                  ? "border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              <button
                type="button"
                onClick={() => handleTabChange("bookmarks")}
                className="font-semibold cursor-pointer w-full"
              >
                Bookmarks
              </button>
            </div>
            <div
              className={`text-center py-3 hover:bg-gray-900 transition-colors ${
                activeTab === "liked-posts"
                  ? "border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              <button
                type="button"
                onClick={() => handleTabChange("liked-posts")}
                className="font-semibold cursor-pointer w-full"
              >
                Liked Posts
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-md font-semibold">{error}</div>
            )}
          </div>
          {/* Bookmarks */}
          <div className="flex flex-col w-full">
            {bookmarks.length === 0 ? (
              <div className="space-y-1 text-center w-full">
                <h1 className="text-4xl font-semibold">Save posts for later</h1>
                <div className="w-full items-center flex justify-center">
                  <p className="max-w-sm text-gray-500 font-semibold">
                    Bookmark posts to easily find them again in the future.
                  </p>
                </div>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={bookmarks.length}
                next={() => {
                  fetchBookmarks(axiosPrivate);
                }}
                hasMore={hasMore}
                loader={<Loader />}
                endMessage={
                  <div className="text-center py-4 text-gray-500">
                    No more bookmarks to load
                  </div>
                }
                scrollableTarget="scrollableDiv"
              >
                {bookmarks.map((bookmark) => (
                  <PostComponent key={bookmark._id} post={bookmark} />
                ))}
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;

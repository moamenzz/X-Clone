import CreatePost from "../components/CreatePost";
import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostComponent from "../components/PostComponent";
import Loader from "../components/Loader";
import { useAuthStore } from "../../store/useAuthStore";
import usePostStore from "../../store/usePostStore";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const HomePage = () => {
  const { accessToken, isAuthenticated, user } = useAuthStore();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    console.log(`Access Token: ${accessToken}`);
    console.log(`Name: ${user.name}`);
    console.log(`Username: ${user.username}`);
    console.log(`Roles: ${user.roles}`);
    console.log(`isAuthenticated: ${isAuthenticated}`);
    console.log(`id: ${user._id}`);
    console.log(`Avatar: ${user.img}`);
  }, [
    accessToken,
    isAuthenticated,
    user.name,
    user.username,
    user.roles,
    user._id,
    user.img,
  ]);

  const {
    posts,
    fetchPosts,
    hasMore,
    error,
    activeTab,
    setActiveTab,
    isLoading,
  } = usePostStore();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    // Set initial tab
    setActiveTab("forYou");
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Reset and fetch posts when tab changes
    fetchPosts(axiosPrivate);
  }, [activeTab]);

  return (
    <div className="flex flex-1 border-l lg:border-x min-h-screen border-gray-800">
      <div className="mx-auto w-full">
        <div className="grid grid-cols-2 border-b border-gray-800">
          <div
            className={`text-center py-3 hover:bg-gray-900 transition-colors ${
              activeTab === "forYou"
                ? "border-b-2 border-blue-500"
                : "text-gray-600"
            }`}
          >
            <button
              type="button"
              onClick={() => handleTabChange("forYou")}
              className="font-semibold cursor-pointer w-full"
            >
              For you
            </button>
          </div>
          <div
            className={`text-center py-3 hover:bg-gray-900 transition-colors ${
              activeTab === "following"
                ? "border-b-2 border-blue-500"
                : "text-gray-600"
            }`}
          >
            <button
              type="button"
              onClick={() => handleTabChange("following")}
              className="font-semibold cursor-pointer w-full"
            >
              Following
            </button>
          </div>
        </div>

        {isAuthenticated && <CreatePost />}

        {error && <div className="text-red-500 text-center py-4">{error}</div>}

        <InfiniteScroll
          dataLength={posts.length}
          next={() => fetchPosts(axiosPrivate)}
          hasMore={hasMore}
          loader={<Loader />}
          endMessage={
            <div className="text-center py-4 text-gray-500">
              No more posts to load
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          {posts.map((post) => (
            <PostComponent key={post._id} post={post} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default HomePage;

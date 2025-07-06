import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import useUserStore from "../../store/useUserStore";
import { useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../components/Loader";
import UserComponent from "../components/UserComponent";

const ConnectPage = () => {
  const axiosPrivate = useAxiosPrivate();

  const { fetchUsers, users, hasMore, activeTab, setActiveTab, error } =
    useUserStore();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setActiveTab("suggested-users");
  }, []);

  useEffect(() => {
    fetchUsers(axiosPrivate);
  }, [activeTab]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center w-full space-y-5">
          {/* Header */}
          <div className="flex justify-start w-full items-center gap-10 ">
            <Link to="/">
              <IoMdArrowBack className="text-2xl font-bold " />
            </Link>
            <h2 className="text-xl font-semibold">Connect</h2>
          </div>
          <div className="grid grid-cols-3 border-b border-gray-800 w-full">
            <div
              className={`text-center py-3 hover:bg-gray-900 transition-colors ${
                activeTab === "suggested-users"
                  ? "border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              <button
                type="button"
                onClick={() => handleTabChange("suggested-users")}
                className="font-semibold cursor-pointer w-full"
              >
                Who to follow
              </button>
            </div>
            <div
              className={`text-center py-3 hover:bg-gray-900 transition-colors ${
                activeTab === "creators-for-you"
                  ? "border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              <button
                type="button"
                onClick={() => handleTabChange("creators-for-you")}
                className="font-semibold cursor-pointer w-full"
              >
                Creators for you
              </button>
            </div>
            <div
              className={`text-center py-3 hover:bg-gray-900 transition-colors ${
                activeTab === "you-follow"
                  ? "border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              <button
                type="button"
                onClick={() => handleTabChange("you-follow")}
                className="font-semibold cursor-pointer w-full"
              >
                You already follow
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-center py-4">{error}</div>
          )}

          <div className="w-full">
            <InfiniteScroll
              dataLength={users.length}
              next={() => fetchUsers(axiosPrivate)}
              hasMore={hasMore}
              loader={<Loader />}
              endMessage={
                <div className="text-center py-4 text-gray-500">
                  No more users to load
                </div>
              }
              scrollableTarget="scrollableDiv"
            >
              {users.map((user) => (
                <UserComponent key={user._id} userToFollow={user} />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectPage;

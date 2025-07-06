import { useEffect } from "react";
import { Link } from "react-router-dom";
import useUserStore from "../../store/useUserStore.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.jsx";
import RightPanelSkeleton from "./skeletons/RightPanelSkeleton.jsx";

const WhoToFollow = () => {
  const axiosPrivate = useAxiosPrivate();

  const { fetchSidebarUsers, sidebarUsers, setActiveTab, isLoading } =
    useUserStore();
  useEffect(() => {
    fetchSidebarUsers(axiosPrivate);
    console.log(sidebarUsers);
  }, [fetchSidebarUsers]);

  useEffect(() => {
    setActiveTab("suggested-users");
  }, []);

  return (
    <div className="border-1 border-gray-700 p-4 rounded-xl w-[20rem]">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <h1 className="text-xl font-semibold ">Who to follow</h1>
        {/* Suggestions */}
        {isLoading && (
          <div className="text-3xl ">
            <RightPanelSkeleton />
          </div>
        )}
        {sidebarUsers?.map((user, index) => (
          <div
            key={index}
            className="flex justify-between mt-auto hover:bg-gray-900 duration-300 transition-colors rounded-full p-2"
          >
            <div className="flex justify-center items-center gap-3">
              {/* Logo */}
              <Link to={`users/${user?.username}`}>
                <img
                  src={user?.img || "/avatar-placeholder.png"}
                  alt="placeholder"
                  className="w-12 rounded-full"
                />
              </Link>
              {/* Account name & Username */}
              <Link to={`users/${user?.username}`}>
                <h2 className="text-md font-semibold">{user?.name}</h2>
                <p className="text-md font-semibold text-gray-500">
                  @{user?.username}
                </p>
              </Link>
            </div>
            {/* Follow Button */}
            <div className="flex items-center justify-center">
              <button
                type="button"
                className={`w-[6rem] h-[3rem] border rounded-full font-semibold cursor-pointer bg-white text-black`}
              >
                Follow
              </button>
            </div>
          </div>
        ))}

        {/* Show More */}
        <Link
          to="/connect"
          className="hover:bg-gray-900 duration-300 text-center transition-colors rounded-full p-2 cursor-pointer text-md font-semibold"
        >
          Show More
        </Link>
      </div>
    </div>
  );
};

export default WhoToFollow;

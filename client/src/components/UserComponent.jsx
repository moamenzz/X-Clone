import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";
import useUserStore from "../../store/useUserStore.js";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.jsx";
import { useEffect, useState } from "react";
import useMessageStore from "../../store/useMessageStore.js";

const UserComponent = ({ userToFollow }) => {
  const { user } = useAuthStore();
  const { isMessages } = useMessageStore();
  const { activeTab } = useUserStore();
  const { setRecipient, recipient } = useMessageStore();
  const [localUser, setLocalUser] = useState(user);

  const userId = userToFollow._id;
  const isFollowing = localUser?.following?.includes(localUser._id);
  const isAlreadyFollowing = user?.following?.includes(userId);

  const { followUnfollowUser, isLoading, error } = useUserStore();
  const axiosPrivate = useAxiosPrivate();

  const handleFollow = async () => {
    setLocalUser((prev) => ({
      ...prev,
      following: isFollowing
        ? prev.followers.filter((id) => id !== user._id)
        : [...(prev.followers || []), user._id],
    }));

    try {
      await followUnfollowUser(axiosPrivate, userId);
      toast.success("User followed successfully");
    } catch (e) {
      setLocalUser(userToFollow);
      console.error(e);
      toast.error("Failed to follow user");
    }
  };

  const handleMessage = async () => {
    try {
      setRecipient(userToFollow);
      console.log("Recipient changed: " + recipient._id);
    } catch (e) {
      console.error(e);
    }
  };

  // useEffect(() => {
  //   console.log(isFollowing);
  // }, [handleFollow]);

  return (
    <div className="flex justify-between mt-auto hover:bg-gray-900 duration-300 transition-colors rounded-full p-2">
      <div className="flex justify-center items-center gap-3">
        {/* Logo */}
        {isMessages ? (
          <div>
            <img
              src={userToFollow?.img || "/avatar-placeholder.png"}
              alt="placeholder"
              className="w-12 rounded-full"
            />
          </div>
        ) : (
          <Link to={`/users/${userToFollow?.username}`}>
            <img
              src={userToFollow?.img || "/avatar-placeholder.png"}
              alt="placeholder"
              className="w-12 rounded-full"
            />
          </Link>
        )}

        {/* Account name & Username */}
        {isMessages ? (
          <div>
            <h2 className="text-md font-semibold">{userToFollow?.name}</h2>
            <p className="text-md font-semibold text-gray-500">
              @{userToFollow?.username}
            </p>{" "}
          </div>
        ) : (
          <Link to={`/users/${userToFollow?.username}`}>
            <h2 className="text-md font-semibold">{userToFollow?.name}</h2>
            <p className="text-md font-semibold text-gray-500">
              @{userToFollow?.username}
            </p>
          </Link>
        )}
      </div>
      {/* Follow Button */}
      <div className="flex items-center justify-center">
        {isMessages ? (
          <button
            type="button"
            className={`w-[6rem] h-[3rem]  border rounded-full font-semibold cursor-pointer bg-white text-black `}
            onClick={handleMessage}
          >
            Message
          </button>
        ) : activeTab === "you-follow" ? (
          <button
            type="button"
            className={`w-[6rem] h-[3rem]  border rounded-full font-semibold cursor-pointer ${
              isAlreadyFollowing ? "bg-black text-white" : "bg-white text-black"
            } `}
            onClick={handleFollow}
          >
            {isAlreadyFollowing ? "Unfollow" : "Follow"}
          </button>
        ) : (
          <button
            type="button"
            className={`w-[6rem] h-[3rem]  border rounded-full font-semibold cursor-pointer ${
              isFollowing ? "bg-black text-white" : "bg-white text-black"
            } `}
            onClick={handleFollow}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserComponent;

import { FaRegCalendarDays } from "react-icons/fa6";
import ToFollow from "../components/ToFollow";
import { useAuthStore } from "../../store/useAuthStore";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import EditProfileModal from "../components/EditProfileModal";
import ProfileHeaderSkeleton from "../components/skeletons/ProfileHeaderSkeleton.jsx";
import useMessageStore from "../../store/useMessageStore.js";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const axiosPrivate = useAxiosPrivate();

  const { username } = useParams();

  const { user, fetchUserProfile, visitedUser, error, isLoading } =
    useAuthStore();

  const { setIsMessages, unhideChatHead, recipient } = useMessageStore();

  const recipientId = visitedUser._id;

  const isMyProfile = user?.username === visitedUser.username;
  useEffect(() => {
    fetchUserProfile(axiosPrivate, username);
    console.log("Params" + visitedUser);
  }, [username]);

  const handleMessage = async () => {
    try {
      setIsMessages(true);
      await unhideChatHead(axiosPrivate, recipientId);
      console.log("Chat Head Unhidden", recipientId);
    } catch (e) {
      console.error(e);
      toast.error("Failed to send message: " + e.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex ">
        <ProfileHeaderSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-1 border-l lg:border-x min-h-screen border-gray-800">
      <div className="mx-auto w-full max-w-[600px] lg:max-w-none">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 bg-gray-700">
            <img
              src={visitedUser?.coverImg}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-4">
            <img
              src={visitedUser?.img || "/avatar-placeholder.png"}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-black"
            />
          </div>
          {/* Follow Button */}
          {isMyProfile ? (
            <div className="absolute top-4 right-4">
              <EditProfileModal authUser={user} />
            </div>
          ) : (
            <div className="absolute top-4 right-4">
              <button className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors cursor-pointer">
                Follow
              </button>
            </div>
          )}
        </div>
        {/* User Details */}
        <div className="mt-20 px-4">
          <h1 className="text-2xl font-bold">{visitedUser?.name}</h1>
          {error && <div className="text-red-500 font-semibold text-md"></div>}
          <p className="text-gray-500">@{visitedUser?.username}</p>
          <div className="flex justify-between items-center">
            <div>
              <p className="mt-2">{visitedUser?.bio}</p>
            </div>
            <div>
              {isMyProfile ? (
                ""
              ) : (
                <Link
                  to={`/messages`}
                  className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                  onClick={handleMessage}
                >
                  Message
                </Link>
              )}
            </div>
          </div>
          <div className="flex space-x-4 text-gray-500 mt-2">
            <span>{visitedUser?.location}</span>
          </div>
          <p className="flex  items-center gap-2 text-gray-500 mt-2">
            <span>
              <FaRegCalendarDays />
            </span>
            Joined{" "}
            {new Date(visitedUser?.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
          {/* Followings */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex gap-1">
              <span>{visitedUser?.followingCount || 0}</span>
              <p className="text-gray-600 text-md font-semibold">Following</p>
            </div>
            <div className="flex gap-1">
              <span>{visitedUser?.followersCount || 0}</span>
              <p className="text-gray-600 text-md font-semibold">Followers</p>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="grid grid-cols-4 mt-6 border-b border-gray-800">
          {["Posts", "Replies", "Media", "Likes"].map((tab, index) => (
            <div
              key={index}
              className="text-center py-3 cursor-pointer hover:bg-gray-900 transition-colors"
            >
              <span className="font-semibold">{tab}</span>
            </div>
          ))}
        </div>
        <div>
          <ToFollow />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

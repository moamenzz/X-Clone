import { BiRepost } from "react-icons/bi";
import { FaHeart, FaUser } from "react-icons/fa";
import { TfiCommentAlt } from "react-icons/tfi";
import { Link } from "react-router-dom";

const NotificationComponent = ({ notification }) => {
  return (
    <div className="border-b border-gray-700 cursor-pointer hover:bg-gray-900 transition-colors">
      <div className="flex gap-4 items-top p-4">
        {notification?.type === "follow" && (
          <FaUser className="w-7 h-7 text-primary" />
        )}
        {notification?.type === "like" && (
          <FaHeart className="w-8 h-8 text-red-500" />
        )}
        {notification?.type === "repost" && (
          <BiRepost className="w-10 h-10 text-green-500" />
        )}
        {notification?.type === "comment" && (
          <TfiCommentAlt className="w-7 h-7 text-green-500" />
        )}
        <Link to={`/profile/${notification?.from?.username}`}>
          <div className="avatar">
            <div className="w-8 rounded-full">
              <img src={notification?.from?.img || "/avatar-placeholder.png"} />
            </div>
          </div>
          <div className="flex gap-1">
            <span className="font-bold">@{notification?.from?.username}</span>{" "}
            {notification?.type === "follow"
              ? "followed you"
              : notification?.type === "like"
              ? "liked your post"
              : notification?.type === "repost"
              ? "reposted a post of yours"
              : notification?.type === "comment"
              ? "commented on your post"
              : "did something"}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NotificationComponent;

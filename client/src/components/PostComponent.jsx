import { BiRepost } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { IoMdShare } from "react-icons/io";
import { IoStatsChartSharp } from "react-icons/io5";
import { TfiCommentAlt } from "react-icons/tfi";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import usePostStore from "../../store/usePostStore";
import { axiosPrivate } from "../../lib/axiosInstances";
import { toast } from "react-toastify";
import CreatePost from "./CreatePost";
import Comment from "./Comment";
import { useRef, useState } from "react";
import formatDate from "../../lib/formatDate";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import Loader from "./Loader";

const PostComponent = ({ post }) => {
  const postId = post._id;
  if (!post || !postId) {
    return null;
  }

  const { user } = useAuthStore();
  const {
    deletePost,
    likeUnlikePost,
    repost,
    comment,
    isLoading,
    bookmark,
    error,
  } = usePostStore();

  const [localPost, setLocalPost] = useState(post);
  const [localUser, setLocalUser] = useState(user);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const hasLiked = localPost.likes?.includes(user?._id);
  const hasReposted = localPost.reposts?.includes(user?._id);
  const hasBookmarked = localUser.bookmarkedPosts?.includes(user?._id);
  const isAuthor = user?._id === post?.user?._id;

  // Get counts for interactions
  const likesCount = localPost.likes?.length || 0;
  const repostsCount = localPost.reposts?.length || 0;
  const commentsCount = post.comments?.length || 0;
  const viewsCount = post.views || 0;

  const handleDeletePost = async () => {
    try {
      await deletePost(axiosPrivate, postId);
      toast.success("Post deleted successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete post: " + e.message);
      return;
    }
  };

  const handleBookmarkPost = async () => {
    setLocalUser((prev) => ({
      ...prev,
      bookmarkedPosts: hasBookmarked
        ? prev.bookmarkedPosts.filter((id) => id !== user._id)
        : [...prev.bookmarkedPosts, user._id],
    }));
    try {
      await bookmark(axiosPrivate, postId);
      console.log("Post Bookmarked Successfully" + postId);
    } catch (e) {
      toast.error("Failed to like post: " + e.message);
      console.error(e);
    }
  };

  const handleLikePost = async () => {
    setLocalPost((prev) => ({
      ...prev,
      likes: hasLiked
        ? prev.likes.filter((id) => id !== user._id)
        : [...prev.likes, user._id],
    }));
    try {
      await likeUnlikePost(axiosPrivate, postId);
      console.log("Post Liked Successfully" + postId);
    } catch (e) {
      setLocalPost(post);
      toast.error("Failed to like post: " + e.message);
      console.error(e);
    }
  };

  const handleRepost = async () => {
    setLocalPost((prev) => ({
      ...prev,
      reposts: hasReposted
        ? prev.reposts.filter((id) => id !== user._id)
        : [...prev.reposts, user._id],
    }));
    try {
      await repost(axiosPrivate, postId);
      console.log("Post reposted Successfully" + postId);
    } catch (e) {
      setLocalPost(post);
      toast.error("Failed to like post: " + e.message);
      console.error(e);
    }
  };

  const handleSubmitComment = async (e) => {
    try {
      e.preventDefault();
      if (!text.trim()) {
        toast.error("Comment cannot be empty");
        return;
      }
      await comment(axiosPrivate, postId, text, img);
      setText("");
      setImg(null);
      if (imgRef.current) {
        imgRef.current.value = null;
      }
      document.getElementById(`comment-modal-${post._id}`).close();
      toast.success("Comment posted successfully!");
    } catch (e) {
      toast.error("Failed to like post: " + e.message);
      console.error(e);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col border-y border-gray-800">
      {/* Author Info */}
      <div className="flex justify-between items-center p-2">
        <div className="flex items-center space-x-2">
          <Link className="w-8" to={`users/${post?.user?._id}`}>
            <img
              src={post?.user?.img || "/default-avatar.png"}
              alt="avatar"
              className="rounded-xl"
            />
          </Link>
          <Link to={`users/${post?.user?._id}`}>
            <h2 className="text-md font-semibold">
              {post?.user?.name || "Unknown User"}
            </h2>
          </Link>
          <div className="flex items-center space-x-1">
            <p className="text-md font-semibold text-gray-500">
              @{post?.user?.username || "unknown"}
            </p>
            <span className="text-lg font-semibold text-gray-500">·</span>
            <p className="text-md font-semibold text-gray-500">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center relative">
          <div className="absolute left-[-105%] dropdown dropdown-bottom dropdown-end group">
            <button
              tabIndex={0}
              className="btn bg-transparent border-none shadow-none"
            >
              <BsThreeDots className="text-xl font-semibold text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu shadow rounded-box w-52 bg-black text-white"
            >
              <Link to={`/posts/engagements/${post._id}`}>
                <li>
                  <a className="font-semibold text-md">View Post Engagements</a>
                </li>
              </Link>
              <li>
                <a className="font-semibold text-md">Report Post</a>
              </li>
              {isAuthor && (
                <li onClick={handleDeletePost}>
                  <a className="text-red-500 font-semibold text-md">
                    Delete Post
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="group">
            <FaRegBookmark
              className={`text-lg font-semibold ${
                hasBookmarked
                  ? "text-yellow-400"
                  : "group-hover:text-yellow-400 transition-colors duration-200"
              }    cursor-pointer`}
              onClick={handleBookmarkPost}
            />
          </div>
          <div className="group">
            <IoMdShare className="text-lg font-semibold text-gray-400 group-hover:text-green-500 transition-colors duration-200 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="p-2">
        <p>{post?.text || ""}</p>
        {post?.img && (
          <div className="flex justify-center aspect-auto items-center w-full">
            <img
              src={post.img}
              alt="attachment"
              className="cursor-pointer rounded-lg object-contain overflow-hidden"
            />
          </div>
        )}
      </div>

      {/* Activity Buttons */}
      <div className="flex items-center justify-center pt-2 relative">
        <div className="flex space-x-14">
          <div className="flex items-center gap-2 group">
            <TfiCommentAlt
              className="text-lg font-semibold text-gray-400 group-hover:text-primary transition-colors duration-200 cursor-pointer"
              onClick={() =>
                document.getElementById(`comment-modal-${post._id}`).showModal()
              }
            />
            <p className="text-md font-semibold text-gray-500">
              {commentsCount > 0 ? commentsCount : "0"}
            </p>
            <dialog id={`comment-modal-${post._id}`} className="modal">
              <div className="modal-box bg-black">
                <div>
                  <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
                  <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                    {post?.comments?.length === 0 && (
                      <p className="text-sm text-slate-500">
                        No comments yet 🤔 Be the first one 😉
                      </p>
                    )}
                    {post?.comments?.map((comment) => (
                      <div
                        key={comment?._id}
                        className="flex gap-2 items-start"
                      >
                        <div className="avatar">
                          <div className="w-8 rounded-full">
                            <img
                              src={
                                comment?.user?.img || "/avatar-placeholder.png"
                              }
                            />
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-bold">
                              {comment?.user?.name}
                            </span>
                            <span className="text-gray-700 text-sm">
                              @{comment?.user?.username}
                            </span>
                          </div>
                          <div className="text-sm">{comment?.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form
                    className="flex flex-col gap-2 items-center mt-4 pt-2"
                    onSubmit={handleSubmitComment}
                  >
                    <textarea
                      className="textarea w-full p-1 bg-black rounded text-md resize-none border focus:outline-none  border-gray-800"
                      placeholder="Add a comment..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    {/* Display Image */}
                    {img && (
                      <div className="relative w-72 mx-auto">
                        <img src={img} className="w-full object-cover" />
                        <IoCloseSharp
                          className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
                          onClick={() => {
                            setImg(null);
                            imgRef.current.value = null;
                          }}
                        />
                      </div>
                    )}
                    <div className="flex justify-between items-center w-full">
                      {/* Upload Image Button */}
                      <div>
                        <div className="flex gap-1 items-center">
                          <CiImageOn
                            className="fill-primary w-6 h-6 cursor-pointer"
                            onClick={() => imgRef.current.click()}
                          />
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          ref={imgRef}
                          onChange={handleImageChange}
                        />
                      </div>
                      {/* Submit Button */}
                      <button
                        className="btn btn-primary rounded-full btn-sm text-white px-4"
                        onClick={handleSubmitComment}
                        type="button"
                      >
                        {isLoading ? <Loader /> : "Post"}
                      </button>
                    </div>
                  </form>
                  {error && (
                    <div className="text-red-500 font-semibold text-md">
                      {error}
                    </div>
                  )}
                </div>
                <div className="modal-action">
                  <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn bg-black">Close</button>
                  </form>
                </div>
              </div>
            </dialog>
          </div>
          <div className="flex items-center gap-2 group">
            <BiRepost
              className={`text-2xl font-semibold ${
                hasReposted
                  ? "text-green-400"
                  : "group-hover:text-green-500 transition-colors duration-200"
              }   cursor-pointer`}
              onClick={handleRepost}
            />
            <p className="text-md font-semibold text-gray-500">
              {repostsCount > 0 ? repostsCount : "0"}
            </p>
          </div>
          <div className="flex items-center gap-2 group">
            <FaRegHeart
              className={`text-lg font-semibold ${
                hasLiked
                  ? "text-pink-600"
                  : "group-hover:text-pink-600 transition-colors duration-200"
              }   cursor-pointer`}
              onClick={handleLikePost}
            />
            <p className="text-md font-semibold text-gray-500">
              {likesCount > 0 ? likesCount : "0"}
            </p>
          </div>
          <div className="flex items-center gap-2 group">
            <IoStatsChartSharp className="text-lg font-semibold text-gray-400 group-hover:text-primary transition-colors duration-200 cursor-pointer" />
            <p className="text-md font-semibold text-gray-500">
              {viewsCount > 0 ? viewsCount : "0"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComponent;

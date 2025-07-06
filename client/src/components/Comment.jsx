import { useEffect, useRef, useState } from "react";
import Loader from "./Loader.jsx";
import { CiImageOn } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import usePostStore from "../../store/usePostStore";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

const Comment = ({ post }) => {
  const postId = post._id;

  if (!post || !postId) {
    return null;
  }
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const imgRef = useRef(null);

  const { comment, error, isLoading } = usePostStore();

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setText("");
    setImg(null);
    if (imgRef.current) {
      imgRef.current.value = null;
    }
    console.log("changed");
  }, [post._id]);

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
      document.getElementById("my_modal_2").close();
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
    <div>
      <h3 className="font-bold text-lg mb-4">COMMENTS</h3>
      <div className="flex flex-col gap-3 max-h-60 overflow-auto">
        {post?.comments?.length === 0 && (
          <p className="text-sm text-slate-500">
            No comments yet 🤔 Be the first one 😉
          </p>
        )}
        {post?.comments?.map((comment) => (
          <div key={comment?._id} className="flex gap-2 items-start">
            <div className="avatar">
              <div className="w-8 rounded-full">
                <img src={comment?.user?.img || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-bold">{comment?.user?.name}</span>
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
        <div className="text-red-500 font-semibold text-md">{error}</div>
      )}
    </div>
  );
};

export default Comment;

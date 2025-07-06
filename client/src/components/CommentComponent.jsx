const CommentComponent = ({ comment }) => {
  return (
    <div className="flex gap-2 items-start border-b border-gray-500 space-y-3 my-3">
      <div className="avatar">
        <div className="w-12 rounded-full">
          <img src={comment.user?.img || "/avatar-placeholder.png"} />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-md">{comment.user?.name}</span>
          <span className="text-gray-600 text-md font-semibold">
            @{comment.user?.username}
          </span>
        </div>
        <div className="text-sm pt-1">{comment?.text}</div>
        {comment.img && (
          <div>
            <img src={comment?.img} alt="Comment Attachement" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentComponent;

import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import { formatMessageTime } from "../../lib/formatMessageTime.js";
import useMessageStore from "../../store/useMessageStore.js";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.jsx";
import { toast } from "react-toastify";
import { BsThreeDots } from "react-icons/bs";

const ChatContainer = () => {
  const { user } = useAuthStore();
  const { messages, recipient, fetchChatHistory, deleteMessage, error } =
    useMessageStore();
  const messageEndRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();

  const recipientId = recipient?._id;

  useEffect(() => {
    fetchChatHistory(axiosPrivate, recipientId);
    console.log(recipientId);
  }, [recipient]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, recipientId, user._id]);

  const handleDeleteMessage = async (messageId) => {
    try {
      console.log(messageId);
      await deleteMessage(axiosPrivate, messageId);
      toast.success("Message deleted successfully");
    } catch (e) {
      toast.error("Failed to delete message: " + e.message);
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto w-full h-[92vh]">
      <ChatHeader />
      {error && (
        <div className="text-red-500 text-md font-semibold">
          {toast.error(error)}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat ${
              message.sender === user._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.sender === user._id
                      ? user.img || "/avatar-placeholder.png"
                      : recipient.img || "/avatar-placeholder.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1 items-center gap-3">
              <div className="hidden lg:flex">
                <div className="dropdown dropdown-bottom">
                  <button
                    tabIndex={0}
                    className="btn bg-transparent border-none shadow-none"
                  >
                    <BsThreeDots className="text-xl font-semibold" />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu shadow rounded-box w-52 bg-black text-white"
                  >
                    <li>
                      <a>Report Message</a>
                    </li>
                    {message.sender === user._id && (
                      <div>
                        <li onClick={() => handleDeleteMessage(message._id)}>
                          <a className="text-red-500">Delete message</a>
                        </li>
                      </div>
                    )}
                  </ul>
                </div>
              </div>

              {message.sender === user._id ? user.username : recipient.username}
            </div>
            <div>
              <div className="chat-bubble flex flex-col">
                {message.img && (
                  <img
                    src={message.img}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.message && <p>{message.message}</p>}
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ChatInput />
    </div>
  );
};

export default ChatContainer;

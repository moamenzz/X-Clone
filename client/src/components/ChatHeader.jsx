import { X } from "lucide-react";
import useMessageStore from "../../store/useMessageStore";
import { BsThreeDots } from "react-icons/bs";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "react-toastify";

const ChatHeader = () => {
  const { recipient, setRecipient, hideChatHead } = useMessageStore();
  const { onlineUsers } = useMessageStore();

  const axiosPrivate = useAxiosPrivate();

  const recipientId = recipient._id;
  const isUserOnline = onlineUsers.includes(recipientId);

  const handleHideChat = async () => {
    try {
      console.log(recipientId);
      await hideChatHead(axiosPrivate, recipientId);
      toast.success(
        "Chat Hidden successfully. Visit user profile to recover it."
      );
      setRecipient(null);
    } catch (e) {
      toast.error("Failed to hide chat head: " + e.message);
      console.error(e);
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar relative">
            <div className="size-10 rounded-full ">
              <img
                src={recipient?.img || "/avatar-placeholder.png"}
                alt={recipient?.username}
              />
              {isUserOnline && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
               rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-gray-500">
              @{recipient?.username}
            </h3>
            <p className="text-sm text-base-content/70">
              {isUserOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex">
          {/* Close button */}
          <button onClick={() => setRecipient(null)}>
            <X className="cursor-pointer" />
          </button>
          <div className="hidden lg:flex">
            <div className="dropdown dropdown-bottom dropdown-end">
              <button
                tabIndex={0}
                className="btn bg-transparent border-none shadow-none"
              >
                <BsThreeDots className="text-2xl font-semibold text-white" />
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu shadow rounded-box w-52 bg-black text-white"
              >
                <li onClick={handleHideChat}>
                  <a className="text-md font-semibold">Hide chat</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

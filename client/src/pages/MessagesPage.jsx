import { IoSettingsOutline } from "react-icons/io5";
import { LuMessageSquareDot } from "react-icons/lu";
import useMessageStore from "../../store/useMessageStore";
import ChatContainer from "../components/ChatContainer.jsx";

const MessagesPage = () => {
  const { recipient } = useMessageStore();

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center w-full space-y-5">
          {/* Header */}
          <div className="flex justify-between items-center w-full px-6 ">
            <h2 className="text-xl font-semibold">Messages</h2>
            <div className="flex gap-3">
              <IoSettingsOutline className="text-xl font-semibold cursor-pointer" />
              <LuMessageSquareDot className="text-xl font-semibold cursor-pointer" />
            </div>
          </div>
          {/* Messages */}
          {!recipient ? (
            <div className="flex flex-col max-w-sm space-y-1">
              <h1 className="text-4xl font-semibold">Welcome to your inbox!</h1>
              <p className="text-gray-500 font-semibold text-md">
                Drop a line, share posts and more with private conversations
                between you and others on X.
              </p>
              <p className="pt-3 text-gray-500 font-semibold text-md">
                Follow or message users to see them here!
              </p>
            </div>
          ) : (
            <div className="w-full h-full">
              <ChatContainer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

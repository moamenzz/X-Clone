import { useEffect } from "react";
import useMessageStore from "../../store/useMessageStore.js";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "./Loader";
import UserComponent from "./UserComponent";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ChatHeads = () => {
  const { chatHeads, fetchChatHeads, hasMore } = useMessageStore();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    fetchChatHeads(axiosPrivate);
  }, [axiosPrivate]);
  return (
    <div className="w-full px-3 py-4 border border-gray-800">
      <div className="flex flex-col space-y-3">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold line-clamp-2">Chat Heads</h1>
        </div>
        <InfiniteScroll
          dataLength={chatHeads.length}
          next={() => fetchChatHeads(axiosPrivate)}
          hasMore={hasMore}
          loader={<Loader />}
          endMessage={
            <div className="text-center py-4 text-gray-500">
              No more users to load
            </div>
          }
          scrollableTarget="scrollableDiv"
        >
          {chatHeads.map((head) => (
            <UserComponent key={head._id} userToFollow={head} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ChatHeads;

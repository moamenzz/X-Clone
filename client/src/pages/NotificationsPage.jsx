import { IoSettingsOutline } from "react-icons/io5";
import { useEffect } from "react";
import useNotificationStore from "../../store/useNotificationStore.js";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import NotificationComponent from "../components/NotificationComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../components/Loader.jsx";

const NotificationsPage = () => {
  const axiosPrivate = useAxiosPrivate();

  const { notifications, fetchNotifications, error, hasMore, isLoading } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications(axiosPrivate);
  }, [axiosPrivate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center w-full space-y-5">
          {/* Header */}
          <div className="flex justify-between items-center w-full px-6 ">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <IoSettingsOutline className="text-xl font-semibold cursor-pointer" />
          </div>
          {/* Algorithm */}
          <div className="grid grid-cols-3 border-b border-gray-800 w-full">
            <div
              className={`text-center py-3 hover:bg-gray-900 transition-colors 
                 border-b-2 border-blue-500"
              `}
            >
              <button
                type="button"
                className="font-semibold cursor-pointer w-full"
              >
                All
              </button>
            </div>
            <div
              className={`text-center py-3 hover:bg-gray-900 transition-colors`}
            >
              <button
                type="button"
                className="font-semibold cursor-pointer w-full"
              >
                Verified
              </button>
            </div>
            <div
              className={`text-center py-3 hover:bg-gray-900 transition-colors `}
            >
              <button
                type="button"
                className="font-semibold cursor-pointer w-full"
              >
                Mentions
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-md font-semibold">{error}</div>
            )}
          </div>
          {/* Notifications */}
          <div className="flex flex-col w-full">
            {notifications.length === 0 ? (
              <div className="max-w-sm space-y-1">
                {" "}
                <h1 className="text-4xl font-semibold">
                  Nothing to see here — yet
                </h1>
                <p>
                  From likes to reposts and a whole lot more, this is where all
                  the action happens.
                </p>{" "}
              </div>
            ) : (
              <div className="space-y-1 ">
                <InfiniteScroll
                  loader={<Loader />}
                  dataLength={notifications.length}
                  next={() => fetchNotifications(axiosPrivate)}
                  hasMore={hasMore}
                  endMessage={
                    <div className="text-center py-4 text-gray-500">
                      No more notifications to load
                    </div>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  {notifications.map((notification) => (
                    <NotificationComponent
                      notification={notification}
                      key={notification._id}
                    />
                  ))}
                </InfiniteScroll>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;

import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import usePostStore from "../../store/usePostStore";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../components/Loader.jsx";
import CommentComponent from "../components/CommentComponent.jsx";
import UserComponent from "../components/UserComponent.jsx";
import { useEffect } from "react";
import useEngagementStore from "../../store/useEngagementStore.js";

const EngagementsPage = () => {
  const {
    engagement,
    fetchEngagement,
    activeTab,
    setActiveTab,
    error,
    hasMore,
    isLoading,
  } = useEngagementStore();
  const axiosPrivate = useAxiosPrivate();

  const { postId } = useParams();

  const commentsPage = activeTab === "comments";
  const repostsPage = activeTab === "reposts";

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setActiveTab("comments");
  }, []);

  useEffect(() => {
    fetchEngagement(axiosPrivate, postId);
  }, [activeTab]);

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
          <div className="flex justify-start w-full items-center gap-10 ">
            <Link to="/">
              <IoMdArrowBack className="text-2xl font-bold " />
            </Link>
            <h2 className="text-xl font-semibold">Post Engagements</h2>
          </div>

          <div className="grid grid-cols-2 border-b border-gray-800 w-full">
            <div
              className={`text-center py-3 hover:bg-gray-900 transition-colors ${
                activeTab === "comments"
                  ? "border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              <button
                type="button"
                onClick={() => handleTabChange("comments")}
                className="font-semibold cursor-pointer w-full"
              >
                Comments
              </button>
            </div>
            <div
              className={`text-center py-3 hover:bg-gray-900 transition-colors ${
                activeTab === "reposts"
                  ? "border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
            >
              <button
                type="button"
                onClick={() => handleTabChange("reposts")}
                className="font-semibold cursor-pointer w-full"
              >
                Reposts
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-md font-semibold">{error}</div>
            )}
          </div>
          {/* Engagements */}
          <div className="flex flex-col w-full">
            {engagement.length === 0 ? (
              <div className="space-y-1 text-center w-full">
                <h1 className="text-2xl font-semibold">
                  Post has no {commentsPage ? "comments" : "reposts"} yet.
                </h1>
                <div className="w-full items-center flex justify-center">
                  <p className="max-w-sm text-gray-500 font-semibold">
                    Be the first one to engage by commeting or reposting!
                  </p>
                </div>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={engagement.length}
                next={() => {
                  fetchEngagement(axiosPrivate, postId);
                }}
                hasMore={hasMore}
                loader={<Loader />}
                endMessage={
                  <div className="text-center py-4 text-gray-500">
                    {commentsPage
                      ? "No more comments to load"
                      : "No more reposts to load"}
                  </div>
                }
                scrollableTarget="scrollableDiv"
              >
                {engagement.map((engage) =>
                  commentsPage ? (
                    <CommentComponent key={engage._id} comment={engage} />
                  ) : (
                    <UserComponent key={engage._id} userToFollow={engage} />
                  )
                )}
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementsPage;

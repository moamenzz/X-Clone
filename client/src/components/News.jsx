import React from "react";
import { Link } from "react-router-dom";

const News = () => {
  const newsPosts = [
    {
      title: "Coronavirus: A Global Pandemic",
      author: "John Doe",
      avatar: "/avatar-placeholder.png",
      img: "post-cover.png",
      trendingDate: "Trending now",
      category: "News",
      postCount: "102k",
    },
    {
      title: "Patel's FBI Nomination Vote Postponed by Senate Democrats",
      author: "John Doe",
      avatar: "/avatar-placeholder.png",
      img: "post-cover.png",
      trendingDate: "Trending now",
      category: "News",
      postCount: "102k",
    },
    {
      title: "Gelo's 'Tweaker' Remix with Lil Wayne",
      author: "John Doe",
      avatar: "/avatar-placeholder.png",
      img: "post-cover.png",
      trendingDate: "Trending now",
      category: "News",
      postCount: "102k",
    },
  ];
  return (
    <div className="flex flex-col space-y-6 w-full py-2">
      {/* News */}
      {newsPosts.map((post, index) => (
        <div
          className="flex flex-col w-full hover:bg-gray-900 transition-colors duration-150 space-y-3"
          key={index}
        >
          <div className="flex justify-between">
            <div>
              {/* Header */}
              <Link className="text-xl font-semibold pb-2">{post.title}</Link>
              {/* Info */}
              <div className="flex items-center">
                <Link className="pr-2">
                  <img
                    src={post.avatar}
                    alt="avatar"
                    className="w-8 rounded-full overflow-hidden"
                  />
                </Link>
                <div className="flex text-md font-semibold items-center text-gray-600 space-x-3">
                  <span>{post.trendingDate}</span>
                  <span>·</span>
                  <span>{post.category}</span>
                  <span>·</span>
                  <span>{post.postCount}</span>
                </div>
              </div>
            </div>
            {/* Cover */}
            <div className="flex w-[10rem] aspect-auto justify-end bg-amber-600">
              <img
                src={post.img}
                alt="cover"
                className="w-full overflow-hidden"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default News;

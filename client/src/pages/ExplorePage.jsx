import { IoSettingsOutline } from "react-icons/io5";
import News from "../components/News";
import { BsThreeDots } from "react-icons/bs";
import ToFollow from "../components/ToFollow";

const ExplorePage = () => {
  const trends = [
    { category: "Gaming", title: "BUMP! Superbrawl", posts: "125K" },
    { category: "Technology", title: "React", posts: "89K" },
    { category: "Sports", title: "#WorldCup2026", posts: "45K" },
  ];

  const toFollow = [
    {
      name: "John Doe",
      username: "@johndoe123",
      bio: "Software Engineer | Tech Enthusiast | Lifelong Learner",
      location: "New York, USA",
      website: "https://johndoe.com",
      joinDate: "January 2020",
      coverPhoto: "/cover-photo-placeholder.jpg",
      profilePicture: "/avatar-placeholder.png",
      following: 1,
      followers: 0,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4">
        <div className="flex flex-col items-center w-full">
          {/* Search */}
          <div className="flex justify-around items-center w-full">
            <label className="input bg-black rounded-xl w-2/3">
              <svg
                className="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input type="search" required placeholder="Search" />
            </label>
            {/* Settings */}
            <div className="p-1 hover:bg-gray-600 transition-colors duration-150 rounded-full">
              <IoSettingsOutline className="text-2xl font-bold cursor-pointer " />
            </div>
          </div>
          <div className="w-full pt-3">
            <div className="grid grid-cols-5 border-b border-gray-800">
              {["For you", "Trending", "News", "Sports", "Entertainment"].map(
                (tab, index) => (
                  <div
                    key={index}
                    className="text-center py-3 cursor-pointer hover:bg-gray-900 transition-colors"
                  >
                    <span className="font-semibold">{tab}</span>
                  </div>
                )
              )}
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-full">
            <h1 className="text-2xl font-semibold pb-6 pt-2">Today's news</h1>
            <News />
          </div>
          <div className="flex flex-col justify-start items-start w-full border-t border-gray-800 py-2">
            {" "}
            <div className="divide-y divide-gray-800 w-full">
              {trends.map((trend, index) => (
                <div
                  key={index}
                  className="py-4 hover:bg-gray-900 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">{trend.category}</p>
                      <h3 className="font-bold">{trend.title}</h3>
                      <p className="text-sm text-gray-500">
                        {trend.posts} posts
                      </p>
                    </div>
                    <BsThreeDots className="text-gray-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-full border-t border-gray-800 py-2">
            <h1 className="text-2xl font-semibold pb-6 pt-2">Who to follow</h1>
            <div className="flex flex-col justify-start items-center space-y-3 w-full">
              <ToFollow toFollow={toFollow} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;

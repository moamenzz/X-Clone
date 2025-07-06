import { useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useUserStore from "../../store/useUserStore";
import { Link } from "react-router-dom";

const ToFollow = () => {
  const axiosPrivate = useAxiosPrivate();

  const { fetchSidebarUsers, sidebarUsers } = useUserStore();
  useEffect(() => {
    fetchSidebarUsers(axiosPrivate);
    console.log(sidebarUsers);
  }, [fetchSidebarUsers]);

  return (
    <div className="flex flex-col justify-start items-center space-y-3 w-full">
      {sidebarUsers.map((user, index) => (
        <div
          key={index}
          className="flex justify-between mt-auto hover:bg-gray-900 border-b border-gray-800 duration-300 transition-colors w-full p-2"
        >
          <div className="flex justify-center items-center gap-3 ">
            {/* Logo */}
            <Link to={`users/${user?._id}`}>
              <img
                src={user?.img || "/avatar-placeholder.png"}
                alt="placeholder"
                className="w-12 rounded-full"
              />
            </Link>
            {/* Account name & Username */}
            <Link to={`users/${user?._id}`}>
              <h2 className="text-md font-semibold">{user?.name}</h2>
              <p className="text-md font-semibold text-gray-500">
                @{user?.username}
              </p>
              <p className="text-md font-semibold">{user?.bio}</p>
            </Link>
          </div>
          {/* Follow Button */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              className="w-[6rem] h-[3rem]  border rounded-full font-semibold cursor-pointer bg-white text-black"
            >
              Follow
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToFollow;

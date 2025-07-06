import X from "./X";
import { Link, useNavigate } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { FaRegEnvelope } from "react-icons/fa";
import { PiBookmarkSimple } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { BsThreeDots } from "react-icons/bs";
import { useAuthStore } from "../../store/useAuthStore";
import { MdConnectWithoutContact } from "react-icons/md";
import CreatePost from "./CreatePost";
import useMessageStore from "../../store/useMessageStore";

const Sidebar = () => {
  const { user, logout, setIsAuthenticated } = useAuthStore();
  const { setIsMessages } = useMessageStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(navigate);
      setIsAuthenticated(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-full px-4">
      <div className="flex flex-col space-y-1 flex-1 ">
        {/* Logo */}
        <Link className="pb-4 cursor-pointer w-[2.5rem] pl-2" to="/">
          <X className="fill-white" />
        </Link>
        {/* Elements */}
        <div className="flex flex-col space-y-6">
          <ul className="space-y-4">
            <li>
              <Link
                className="flex flex-row items-center gap-4 hover:bg-gray-900 lg:hover:bg-gray-800 py-4 pl-2 rounded-full w-2/3 duration-300 transition-colors"
                to="/"
                onClick={() => setIsMessages(false)}
              >
                <GoHome className="text-3xl font-bold" />
                <span className="hidden lg:flex text-xl font-normal line-clamp-2">
                  Home
                </span>
              </Link>
            </li>
            <li>
              {" "}
              <Link
                className="flex flex-row items-center gap-4 hover:bg-gray-900 lg:hover:bg-gray-800 py-4 pl-2 rounded-full w-2/3 duration-300 transition-colors"
                to="/explore"
                onClick={() => setIsMessages(false)}
              >
                <IoIosSearch className="text-3xl font-bold" />

                <span className="hidden lg:flex text-xl font-normal line-clamp-2">
                  Explore
                </span>
              </Link>
            </li>
            <li>
              {" "}
              <Link
                className="flex flex-row items-center gap-4 hover:bg-gray-900 lg:hover:bg-gray-800 py-4 pl-2 rounded-full w-2/3 duration-300 transition-colors"
                to="/notifications"
                onClick={() => setIsMessages(false)}
              >
                <IoIosNotificationsOutline className="text-3xl font-bold" />
                <span className="hidden lg:flex text-xl font-normal line-clamp-2">
                  Notifications
                </span>
              </Link>
            </li>
            <li>
              {" "}
              <Link
                className="flex flex-row items-center gap-4 hover:bg-gray-900 lg:hover:bg-gray-800 py-4 pl-2 rounded-full w-2/3 duration-300 transition-colors"
                to="/messages"
                onClick={() => setIsMessages(true)}
              >
                <FaRegEnvelope className="text-3xl font-bold" />
                <span className="hidden lg:flex text-xl font-normal line-clamp-2">
                  Messages
                </span>
              </Link>
            </li>
            <li>
              {" "}
              <Link
                className="flex flex-row items-center gap-4 hover:bg-gray-900 lg:hover:bg-gray-800 py-4 pl-2 rounded-full w-2/3 duration-300 transition-colors"
                to="/bookmarks"
                onClick={() => setIsMessages(false)}
              >
                <PiBookmarkSimple className="text-3xl font-bold" />
                <span className="hidden lg:flex text-xl font-normal line-clamp-2">
                  Bookmarks
                </span>
              </Link>
            </li>
            <li>
              {" "}
              <Link
                className="flex flex-row items-center gap-4 hover:bg-gray-900 lg:hover:bg-gray-800 py-4 pl-2 rounded-full w-2/3 duration-300 transition-colors"
                to="/connect"
                onClick={() => setIsMessages(false)}
              >
                <MdConnectWithoutContact className="text-3xl font-bold" />
                <span className="hidden lg:flex text-xl font-normal line-clamp-2">
                  Connect
                </span>
              </Link>
            </li>
            <li>
              {" "}
              <Link
                className="flex flex-row items-center gap-4 hover:bg-gray-900 lg:hover:bg-gray-800 py-4 pl-2 rounded-full w-2/3 duration-300 transition-colors"
                to={`/users/${user?.username}`}
                onClick={() => setIsMessages(false)}
              >
                <CiUser className="text-3xl font-bold" />
                <span className="hidden lg:flex text-xl font-normal line-clamp-2">
                  Profile
                </span>
              </Link>
            </li>
            <li>
              {" "}
              <Link
                className="flex flex-row items-center gap-4 hover:bg-gray-900 lg:hover:bg-gray-800 py-4 pl-2 rounded-full w-2/3 duration-300 transition-colors"
                to="/settings"
                onClick={() => setIsMessages(false)}
              >
                <IoSettingsOutline className="text-3xl font-bold" />
                <span className="hidden lg:flex text-xl font-normal line-clamp-2">
                  Settings
                </span>
              </Link>
            </li>
          </ul>
          {/* Post Button */}
          <Link
            className="w-16 lg:w-full text-center items-center py-3 border rounded-full font-semibold cursor-pointer hover:bg-white hover:text-black duration-300 transition-colors "
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Post
          </Link>
          <dialog id="my_modal_1" className="modal">
            <div className="modal-box bg-black">
              <CreatePost />
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn bg-black">Close</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
        {/* Profile */}
        {user && (
          <div className="pt-16">
            <div className="flex justify-between items-center gap-3 w-full cursor-pointer hover:bg-gray-900 py-4 pl-2 rounded-full duration-300 transition-colors">
              <div className="flex justify-start gap-3">
                {/* Logo */}
                <div>
                  <img
                    src={user.img}
                    alt="placeholder"
                    className="w-12 rounded-full"
                  />
                </div>
                {/* Account name & Username */}
                <div className="hidden lg:flex lg:flex-col">
                  <h2 className="text-md font-semibold">{user.name}</h2>
                  <p className="text-md font-semibold text-gray-500">
                    @{user.username}
                  </p>
                </div>
              </div>
              <div className="hidden lg:flex">
                <div className="dropdown dropdown-top">
                  <button
                    tabIndex={0}
                    className="btn bg-transparent border-none shadow-none"
                  >
                    <BsThreeDots className="text-3xl font-semibold text-white" />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu shadow rounded-box w-52 bg-black text-white"
                  >
                    <li onClick={handleLogout}>
                      <a className="text-red-500">Logout</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

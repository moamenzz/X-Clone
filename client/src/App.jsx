import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import RightPanel from "./components/RightPanel";
import Sidebar from "./components/Sidebar";
import NotFoundPage from "./pages/NotFoundPage";
import ExplorePage from "./pages/ExplorePage";
import NotificationsPage from "./pages/NotificationsPage";
import MessagesPage from "./pages/MessagesPage";
import BookmarksPage from "./pages/BookmarksPage";
import ProfilePage from "./pages/ProfilePage";
import ConnectPage from "./pages/ConnectPage.jsx";
import { useAuthStore } from "../store/useAuthStore";
import EngagementsPage from "./pages/EngagementsPage.jsx";
import ChatHeads from "./components/ChatHeads.jsx";
import useMessageStore from "../store/useMessageStore.js";
import { useEffect } from "react";
import Layout from "./components/Layout.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import AuthRoutes from "./components/AuthRoutes.jsx";

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { isMessages, initializeSocket } = useMessageStore();
  useEffect(() => {
    if (user) {
      initializeSocket(user._id);
    }
  }, [user]);
  // useEffect(() => {
  //   console.log("Is Messages?" + isMessages);
  // }, [isMessages]);
  return (
    <>
      <div className="min-h-screen bg-black ">
        <div className="max-w-[85rem] mx-auto py-4 px-6">
          <div className="grid grid-cols-12 w-full ">
            {/* Sidebar */}
            <div className="col-span-3 sticky top-0 h-screen">
              {isAuthenticated ? <Sidebar /> : <div />}
            </div>
            {/* Main Content */}
            <div className="col-span-9 border-x border-gray-800 lg:grid lg:col-span-6">
              <Routes>
                <Route element={<AuthRoutes />}>
                  <Route path="/register" element={<RegisterPage />}></Route>
                  <Route path="/login" element={<LoginPage />}></Route>
                </Route>
                <Route path="/" element={<Layout />}>
                  <Route element={<ProtectedRoutes />}>
                    <Route path="/" element={<HomePage />}></Route>
                    <Route path="/explore" element={<ExplorePage />}></Route>
                    <Route
                      path="/notifications"
                      element={<NotificationsPage />}
                    ></Route>
                    <Route path="/messages" element={<MessagesPage />}></Route>
                    <Route
                      path="/bookmarks"
                      element={<BookmarksPage />}
                    ></Route>
                    <Route path="/connect" element={<ConnectPage />}></Route>
                    <Route
                      path="/posts/engagements/:postId"
                      element={<EngagementsPage />}
                    ></Route>
                    <Route
                      path="/users/:username"
                      element={<ProfilePage />}
                    ></Route>
                  </Route>
                </Route>

                <Route path="/*" element={<NotFoundPage />}></Route>
              </Routes>
            </div>
            {/* Right Panel  */}
            {isMessages ? (
              <div className="hidden lg:grid lg:col-span-3 sticky top-0 h-screen">
                <ChatHeads />
              </div>
            ) : (
              <div className="hidden lg:grid lg:col-span-3 sticky top-0 h-screen">
                {isAuthenticated ? <RightPanel /> : <div />}
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default App;

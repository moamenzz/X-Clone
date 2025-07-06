import { useAuthStore } from "../../store/useAuthStore";
import Loader from "./Loader";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AuthRoutes = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    <div className="flex justify-center items-center">
      <Loader />
    </div>;
  }

  return isAuthenticated ? (
    <Navigate to="/" state={{ from: location }} replace />
  ) : (
    <Outlet />
  );
};

export default AuthRoutes;

import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black border-x border-gray-800 ">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-primary mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="px-6 py-3 text-lg bg-none border-2 border-gray-800 rounded-full hover:bg-white hover:text-black duration-300 transition-colors font-semibold outline-none "
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

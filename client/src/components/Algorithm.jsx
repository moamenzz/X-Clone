import { Link } from "react-router-dom";

const Algorithm = ({ categories = [] }) => {
  return (
    <div
      className="grid w-full text-center border-b border-gray-800 min-h-12"
      style={{ gridTemplateColumns: `repeat(${categories.length}, 1fr)` }}
    >
      {categories.map((category, index) => (
        <div
          key={index}
          className="flex flex-col text-lg font-bold text-center items-center cursor-pointer w-full min-h-10 hover:bg-gray-900 duration-200 transition-colors"
        >
          <Link>{category}</Link>
          {/* Active indicator (optional) */}
          {index === 0 && ( // Example: Show indicator for the first category
            <div className="bg-primary items-center flex justify-center max-h-2 w-16 rounded-lg">
              .
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Algorithm;

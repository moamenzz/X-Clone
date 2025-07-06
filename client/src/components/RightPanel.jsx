import WhoToFollow from "./WhoToFollow";

const RightPanel = () => {
  return (
    <div className="min-h-full fixed">
      <div className="mx-auto px-4">
        {/* Trending */}
        <div></div>
        {/* Follow Suggestions */}
        <WhoToFollow />
      </div>
    </div>
  );
};

export default RightPanel;

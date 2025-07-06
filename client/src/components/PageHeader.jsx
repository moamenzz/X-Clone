const PageHeader = ({ title }) => (
  <div className="sticky top-0 bg-black/70 backdrop-blur-md z-10 border-b border-gray-800">
    <h1 className="text-xl font-bold p-4">{title}</h1>
  </div>
);

export default PageHeader;

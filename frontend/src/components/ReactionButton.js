import ReactionIcon from "./ReactionIcon";

const ReactionButton = ({ icon, onClick, isLiked }) => {
  return (
    <button
      className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors duration-200 ${
        isLiked ? "bg-green-500 text-white" : "bg-gray-200 text-gray-600"
      }`}
      onClick={onClick}
    >
      {/* <span>{num}</span> */}

      <ReactionIcon name={icon} />
    </button>
  );
};
export default ReactionButton;

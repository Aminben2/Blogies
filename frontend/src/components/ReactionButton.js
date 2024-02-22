import ReactionIcon from "./ReactionIcon";

const ReactionButton = ({ icon, onClick, isLiked }) => {
  return (
    <button
      title={icon}
      className={`flex items-center space-x-1 p-1 rounded-lg transition-colors duration-400 ${
        isLiked
          ? "dark:bg-green-400 bg-green-500 text-white shadow-lg "
          : "dark:bg-gray-500 bg-gray-100 text-gray-600"
      }`}
      onClick={onClick}
    >
      <ReactionIcon name={icon} />
    </button>
  );
};
export default ReactionButton;

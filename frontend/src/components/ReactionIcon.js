const ReactionIcon = ({ name }) => {
  // This function should return the appropriate SVG icon based on the reaction name
  // For simplicity, we'll just return a placeholder text
  let icon = "";
  switch (name) {
    case "love":
      icon = "./imgs/love.png";
      break;
    case "like":
      icon = "./imgs/like.png";
      break;
    case "wow":
      icon = "./imgs/wow.png";
      break;
    case "care":
      icon = "./imgs/care.png";
      break;
    default:
      icon = "";
  }
  return (
    <img
      className="w-7 hover:scale-150 duration-200"
      src={icon}
      alt="react-icon"
    />
  );
};
export default ReactionIcon;

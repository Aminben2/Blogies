import React from "react";
import { useChatState } from "../context/chatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "../SingleChat";
import { useSelector } from "react-redux";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const darkMode = useSelector((state) => state.theme);

  const { selectedChat } = useChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg={darkMode ? "#9CA3AF" : "white"}
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;

import { Box } from "@chakra-ui/react";
import { useChatState } from "../components/Chat/context/chatProvider";
import SideDrawer from "../components/Chat/miscellaneous/SideDrawer";
import MyChats from "../components/Chat/miscellaneous/MyChats";
import ChatBox from "../components/Chat/miscellaneous/ChatBox";
import { useState } from "react";

const Chats = () => {
  const { user } = useChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }} className="dark:bg-gray-800">
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        padding="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chats;

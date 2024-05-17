import { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";

const ChatContext = createContext();
const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const user = useSelector((state) => state.auth);

  return (
    <ChatContext.Provider
      value={{
        user,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const useChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;

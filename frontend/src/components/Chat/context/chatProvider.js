import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";

const ChatContext = createContext();
const ENDPOINT = "http://localhost:4000"; // Replace with your actual endpoint

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [newNotifs, setNewNotifs] = useState([]);
  const [socket, setSocket] = useState(null);
  const user = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/users/notifications",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setNewNotifs(data);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [ENDPOINT]);

  useEffect(() => {
    if (!user) return;
    if (socket) {
      socket.emit("setup", user);

      socket.on("message received", (newMessageReceived) => {
        // Check if the new message is already in the notifications
        const isMessageInNotifications = notification.some(
          (notif) => notif._id === newMessageReceived._id
        );

        if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
          if (!isMessageInNotifications) {
            setNotification((prevNotifications) => [
              ...prevNotifications,
              newMessageReceived,
            ]);
          }
        }
      });
    }
  }, [socket, selectedChat, user, notification]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setNewNotifs,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        socket,
        newNotifs,
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

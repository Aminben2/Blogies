import React, { useEffect, useState } from "react";
import { useChatState } from "../context/chatProvider";
import { Box, Button, DarkMode, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import { getSender } from "../config/chatLogic";
import GroupChatModal from "./GroupChatModal";
import { useSelector } from "react-redux";

const MyChats = ({ fetchAgain }) => {
  const darkMode = useSelector((state) => state.theme);
  const loggedUser = useSelector((state) => state.auth);
  const { selectedChat, setSelectedChat, user, chats, setChats, setNewNotifs } =
    useChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:4000/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured !",
        description: "Failed to Load Chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);

  const deleteNotifications = async (chatId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      await axios.delete("http://localhost:4000/api/users/notifications", {
        data: { chatId },
        ...config,
      });

      // Optionally update the local state to remove the notifications
      setNewNotifs((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification.chatId !== chatId
        )
      );
    } catch (error) {
      console.error("Failed to delete notifications:", error);
    }
  };
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={"white"}
      className="dark:bg-gray-700"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        className="dark:text-gray-100"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            className="dark:bg-gray-600 dark:text-gray-100"
            _hover={{
              background: darkMode ? "#6B7280" : "#D1D5DB",
              color: "teal.500",
              textColor: darkMode && "white",
            }}
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        className="dark:bg-gray-500"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => {
                  deleteNotifications(chat._id);
                  setSelectedChat(chat);
                }}
                cursor="pointer"
                bg={
                  selectedChat === chat
                    ? "#38A169"
                    : darkMode
                    ? "#9CA3AF"
                    : "#E8E8E8"
                }
                color={
                  selectedChat === chat ? "white" : darkMode ? "white" : "black"
                }
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

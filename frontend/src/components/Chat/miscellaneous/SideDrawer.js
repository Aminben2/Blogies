import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { useChatState } from "../context/chatProvider";
import ProfileModals from "./ProfileModals";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../config/chatLogic";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";
import { useSelector } from "react-redux";

const SideDrawer = () => {
  const darkMode = useSelector((state) => state.theme);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something in Search !",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:4000/api/users?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured !",
        description: "Failed to load search result",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/chat",
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className="dark:bg-gray-700 dark:text-gray-200 shadow-md"
        w="100%"
        p="5px 10px 5px 10px"
      >
        <Tooltip label="Search Users to Chat " hasArrow placement="bottom-end">
          <Button
            variant="ghost"
            onClick={onOpen}
            _hover={{
              background: darkMode ? "#4B5563" : "#F3F4F6",
              color: "teal.500",
            }}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              color={darkMode && "white"}
            />
            <Text
              display={{ base: "none", md: "flex" }}
              px="4"
              textColor={darkMode && "#F3F4F6"}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="monospace">
          Chat
        </Text>
        <div>
          <Menu className="dark:bg-gray-600">
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList
              pl={2}
              className="dark:bg-gray-600 dark:text-gray-100 border-none shadow-lg"
            >
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  className="dark:bg-gray-600 dark:text-gray-100"
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>

            <Menu>
              <MenuButton
                _hover={{
                  background: darkMode ? "#4B5563" : "#F3F4F6",
                  color: "teal.500",
                }}
                bg={darkMode && "#374151"}
                as={Button}
                rightIcon={<ChevronDownIcon color={darkMode && "white"} />}
              >
                <Avatar
                  size="sm"
                  cursor="pointer"
                  name={user.username}
                  src={user.img}
                />
              </MenuButton>
              <MenuList className="border-none shadow-lg dark:bg-gray-700">
                <ProfileModals user={user}>
                  <MenuItem className="dark:bg-gray-700 dark:hover:bg-gray-600">
                    My Profile
                  </MenuItem>
                </ProfileModals>
                <MenuDivider />
              </MenuList>
            </Menu>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent bg={darkMode ? "#374151" : "white"}>
          <DrawerHeader
            textColor={darkMode ? "#F3F4F6" : "black"}
            className="shadow-md mb-5 dark:text-gray-200"
          >
            Search User
          </DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by Username or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button bg={darkMode && "#9CA3AF"} onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;

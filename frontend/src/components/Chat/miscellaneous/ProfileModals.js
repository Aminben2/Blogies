import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";

const ProfileModals = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const darkMode = useSelector((state) => state.theme);
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          height="410px"
          bgColor={darkMode && "#4B5563"}
          textColor={darkMode && "white"}
        >
          <ModalHeader
            fontSize="40px"
            fontFamily="monospace"
            d="flex"
            justifyContent="center"
          >
            {user.username}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={"http://localhost:4000/uploads/" + user.img}
              alt={user.username}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="monospace"
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorscheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModals;

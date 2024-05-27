import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import OneUserStat from "./OneUserStat";

function ReactionStats({ reactions, setShow, show }) {
  const likes = reactions.filter((r) => r.reaction === "like");
  const loves = reactions.filter((r) => r.reaction === "love");
  const wows = reactions.filter((r) => r.reaction === "wow");
  const cares = reactions.filter((r) => r.reaction === "care");

  return (
    <Modal isOpen={show} onClose={setShow}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reactions</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="soft-rounded" colorScheme="gray">
            <TabList>
              <Tab>
                <span>{reactions.length} All</span>
              </Tab>
              <Tab>
                <span className="text-blue-500">{likes.length} like</span>
              </Tab>
              <Tab>
                <span className="text-red-500">{loves.length} love</span>
              </Tab>
              <Tab>
                <span className="text-orange-500">{cares.length} care</span>
              </Tab>
              <Tab>
                <span className="text-yellow-500">{wows.length} wow</span>
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {reactions.map((l) => (
                  <OneUserStat key={l._id} {...l} />
                ))}
              </TabPanel>
              <TabPanel>
                {likes.map((l) => (
                  <OneUserStat key={l._id} {...l} />
                ))}
              </TabPanel>
              <TabPanel>
                {loves.map((l) => (
                  <OneUserStat key={l._id} {...l} />
                ))}
              </TabPanel>
              <TabPanel>
                {cares.map((l) => (
                  <OneUserStat key={l._id} {...l} />
                ))}
              </TabPanel>
              <TabPanel>
                {wows.map((l) => (
                  <OneUserStat key={l._id} {...l} />
                ))}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default ReactionStats;

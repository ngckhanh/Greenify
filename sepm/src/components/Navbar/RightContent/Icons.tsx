import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import {
    IoNotificationsOutline
} from "react-icons/io5";


const ActionIcons: React.FC = () => {
  //   const { toggleMenuOpen } = useDirectory();
  return (
    <Flex alignItems="center" flexGrow={1}>
      <>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={IoNotificationsOutline} fontSize={24} />
        </Flex>
      </>
    </Flex>
  );
};
export default ActionIcons;

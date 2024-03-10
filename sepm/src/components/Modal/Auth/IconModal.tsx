import { Flex, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";

const IconModal = ({ value }: { value: IconType  }) => {
  return (
    <Flex alignItems="center">
      <>
        <Flex
          mr={1.5}
          ml={1.5}
          padding={1}
          cursor="pointer"
          borderRadius={4}
          _hover={{ bg: "gray.200" }}
        >
          <Icon as={value} fontSize={24} />
        </Flex>
      </>
    </Flex>
  );
};
export default IconModal;

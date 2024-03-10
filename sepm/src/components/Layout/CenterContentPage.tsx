import React from 'react';
import { Box, Flex } from "@chakra-ui/react";

type CenterContentPageProps = {
  maxWidth?: string;
  children?: React.ReactNode;
};

const CenterContentPage:React.FC<CenterContentPageProps> = ({
    children,
    maxWidth,
}) => {
    return (
        <Flex justify="center" p="20px 0px" mt="20px">
        <Flex width="95%" justify="center" maxWidth={maxWidth || "860px"}>
        <Flex
          direction="column"
          width={{ base: "100%", md: "60%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
    );
};
export default CenterContentPage;
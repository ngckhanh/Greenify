import React from "react";
import { Box, Flex } from "@chakra-ui/react";

interface PageContentLayoutProps {
  maxWidth?: string;
  children?: React.ReactNode;
}

// Assumes array of two children are passed
const PageContentLayout: React.FC<PageContentLayoutProps> = ({
  children,
  maxWidth,
}) => {
  return (
    <Flex justify="center" p="16px 0px" mt="20px">
      <Flex width="100%" justify="center" maxWidth={maxWidth || "860px"}>
        {/* {/* Left Content /} */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "80%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
        {/* {/ Right Content */} 
        <Box
          display={{ base: "none", md: "flex" }}
          flexDirection="column"
          flexGrow={1}
        >
          {children && children[1 as keyof typeof children]}
        </Box>
      </Flex>
    </Flex>
  );
};

export default PageContentLayout;
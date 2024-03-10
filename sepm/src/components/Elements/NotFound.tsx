import React from "react";
import { Box, Text, Heading, Flex } from "@chakra-ui/react";
import WelcomeScreen from "@/components/Layout/WelcomeScreen";

const NotFound = () => {
  return (
    <WelcomeScreen>
      <>
        <Flex
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="80vh"
          p="3"
          borderRadius={10}
        >
          <Box
            textAlign="center"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Flex direction={"column"} alignItems="center" m="3" p="2">
              <Heading as="h1" fontSize="6xl" color="green.400">
                404: Not Found
              </Heading>
              <Text fontSize="xl" my={5}>
                Oops! The page you are looking for does not exist.
              </Text>
            </Flex>
          </Box>
        </Flex>
      </>
      <Box />
    </WelcomeScreen>
  );
};
export default NotFound;

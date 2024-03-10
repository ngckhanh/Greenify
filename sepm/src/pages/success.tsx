import React from "react";
import { Box, Text, Heading, Flex, Icon, Link } from "@chakra-ui/react";
import WelcomeScreen from "@/components/Layout/WelcomeScreen";
import { CiCircleCheck } from "react-icons/ci";
import { LiaCheckCircleSolid } from "react-icons/lia";
import withAuth from "@/utils/withAuth";
const SuccessInform = () => {
  return (
    <WelcomeScreen>
      <>
        <Flex
          bg={"white"}
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="50vh"
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
              <Icon as={LiaCheckCircleSolid} color="green.400" fontSize={200} />
              <Text fontSize="xl" my={5} width={350}>
                Success! Your action has been completed successfully. You can go
                back to the home page by clicking on the navigartion bar.
              </Text>
            </Flex>
          </Box>
        </Flex>
      </>
      <Box />
    </WelcomeScreen>
  );
};
export default withAuth(SuccessInform);

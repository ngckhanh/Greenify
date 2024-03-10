import ForgotPassword from "../components/Modal/Auth/ForgotPassword";
import { Box, Center, VStack } from "@chakra-ui/react";
import React from "react";
import withAuth from "../utils/withAuth";

const PasswordPage = () => {
  return (
    <>
      <Center h="100vh">
        <Box bg="white" borderRadius={5}>
          <VStack m="50px 100px 50px 100px" direction="column" spacing={5}>
            <ForgotPassword />
          </VStack>
        </Box>
      </Center>
    </>
  );
};

export default withAuth(PasswordPage);

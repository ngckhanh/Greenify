import WelcomeScreen from "@/components/Layout/WelcomeScreen";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  return (
    <WelcomeScreen>
      <>
      <Flex
          bg="white"
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
            <Image
              src="https://i.imgur.com/w5z4Izl.png"
              alt=""
              paddingBottom={2}
              width={"250px"}
            />
            <Text fontSize="lg" textAlign="center">
            Welome to {' '}
            <Text as="span" fontStyle="italic" fontWeight={"500"} color={"green"}>
              Greenify
            </Text>
            {' '}! Here, eco-conscious people get together to make a difference in the world via sharing ideas, working together, and taking action. Wishing you a pleasant experience with our website.
          </Text>

          </Flex>
        </Box>
      </Flex>
      </>
      <Box />
      </WelcomeScreen>
  );
}

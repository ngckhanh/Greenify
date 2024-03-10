import CenterContentPage from "@/components/Layout/CenterContentPage";
import PostForm from "@/components/Post/PostForm";
import { auth } from "@/firebase/clientApp";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Link, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const CreatePostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  //2.
  //We use useAuthState hook to get the user from firebase auth
  return (
    <CenterContentPage>
      <>
          <Flex direction={"row"} alignItems={"center"} pb="2">
            <Link href="/forum">
              <IconButton
                aria-label="Return page"
                variant="outline"
                colorScheme="teal"
                _hover={{ bg: "#0F3320", color: "white" }}
                icon={<ArrowBackIcon />}
                mr="7px"
                w={8}
                h={8}
              />
            </Link>

            <Text fontSize="sm">Return back to forum</Text>
          </Flex>

          {/* //3.
      //We pass the user as props to the PostForm component */}
          {user && <PostForm user={user} />}

      </>
      <Box />
    </CenterContentPage>
  );
};

export default CreatePostPage;

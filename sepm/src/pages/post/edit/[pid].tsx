import { Post } from "@/atoms/PostAtom";
import CenterContentPage from "@/components/Layout/CenterContentPage";
import EditForm from "@/components/Post/EditForm";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Link, Text } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const EditPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const { postVal, setPostVal } = usePosts();
  const router = useRouter();

  const fetchPost = async () => {
    // query pid
    const { pid } = router.query;
    // loading will be implemented later
    // setLoading(true);

    // fetch post
    try {
      const PostRef = doc(firestore, "posts", pid as string);
      const postResult = await getDoc(PostRef);

      console.log("postResult: ", postResult.data());
      // since we are using the postVal to render the post, we need to set it
      // Because the postVal is an object, we need to spread the previous value
      // Why do we need to use as Post? Because the postResult.data() is not a Post type. (orignal type is DocumentData)
      setPostVal((prev) => ({
        ...prev,
        selectedPost: {
          ...postResult.data(),
          id: postResult.id,
        } as Post,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  // check if user is accessing this page directly
  useEffect(() => {
    // log why this useEffect is triggered
    console.log("DetailPost useEffect triggered");
    console.log("router.query: ", router.query);
    const { pid } = router.query;
    console.log("pid: ", pid);

    if (!pid) return;

    // if the poststate is not set, fetch the post
    if (pid && !postVal.selectedPost) {
      fetchPost();
      console.log("fetching post...");
    }
  }, [router.query]);

  return (
    <CenterContentPage>
      <>
        <Box
          p="20px 40px 20px 40px"
          borderBottom="1px solid"
          bg="white"
          borderRadius={4}
          width="full"
        >
          <Flex direction={"row"} alignItems={"center"}>
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

          {user && postVal && (
            <EditForm user={user} selectedPost={postVal.selectedPost} />
          )}
        </Box>
      </>
      <Box />
    </CenterContentPage>
  );
};

export default EditPostPage;

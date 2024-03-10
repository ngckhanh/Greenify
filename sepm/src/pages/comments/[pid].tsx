import { Post } from "@/atoms/PostAtom";
import Comments from "@/components/Post/Comments/Comments";
import PostItem from "@/components/Post/PostItem/PostItem";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Box, Flex, IconButton, Link, Text } from "@chakra-ui/react";

import ForumContent from "@/components/Layout/ForumContent";

import EditForm from "@/components/Post/EditForm";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

type DetailPostProps = {};
const DetailPost: React.FC<DetailPostProps> = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  // import hooks
  const { postVal, setPostVal, onSelectPost, onDelete, onVote } = usePosts();
  const [edit, setEdit] = React.useState(false);

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    setEdit(true);
  };

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
  console.log("API check: ", postVal.selectedPost);

  return (
    <ForumContent>
      <>
        <Box borderRadius={4} width="full">
          <Flex direction={"row"} alignItems={"center"} mb="10px">
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

          {postVal.selectedPost &&
            (edit ? (
              <EditForm user={user!} selectedPost={postVal.selectedPost} />
            ) : (
              <>
                {/* @ts-ignore */}
                <PostItem
                  post={postVal.selectedPost}
                  // onSelectPost={onSelectPost}
                  onVote={onVote}
                  userVoteValue={postVal.selectedPost.userVoteValue}
                  userIsCreator={user?.uid === postVal.selectedPost.creatorId}
                  //onVote is used to update the voteStatus of the post
                  onEditPost={handleEdit}
                  onDeletePost={onDelete}
                />
                <Comments
                  user={user as User}
                  selectedPost={postVal.selectedPost}
                />{" "}
              </>
            ))}
        </Box>
      </>
      <Box />
    </ForumContent>
  );
};

export default DetailPost;

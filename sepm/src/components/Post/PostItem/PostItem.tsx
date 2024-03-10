import { Post } from "@/atoms/PostAtom";
import { Flex, Icon, Image, Skeleton, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import router, { NextRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoChatbubbleOutline,
} from "react-icons/io5";

type PostItemProps = {
  post: Post;
  userIsCreator: boolean;
  userVoteValue?: number;
  router?: NextRouter;
  postIdx?: string;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    postIdx?: string
  ) => void;
  onSelectPost: (post: Post, id: string) => void;
  onEditPost: (event: React.MouseEvent, postId: string) => void;
  onDeletePost: (post: Post) => Promise<boolean>;
};

const postItem: React.FC<PostItemProps> = ({
  post,
  postIdx,
  userIsCreator,
  userVoteValue,
  onVote,
  onSelectPost,
  onEditPost,
  onDeletePost,
  router,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const singlePostView = !onSelectPost; // function not passed to [pid]

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    setLoadingDelete(true);
    try {
      const success = await onDeletePost(post);
      if (!success) throw new Error("Failed to delete post");

      console.log("Post successfully deleted");

      // Could proably move this logic to onDeletePost function
      if (router) router.back();
    } catch (error: any) {
      console.log("Error deleting post", error.message);
      /**
       * Don't need to setLoading false if no error
       * as item will be removed from DOM
       */
      setLoadingDelete(false);
      // setError
    }
  };

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor="green.200"
      borderRadius={4}
      _hover={{ borderColor: "#233814" }}
      cursor="pointer"
      onClick={() => onSelectPost && post && onSelectPost(post, postIdx!)}
    >
      <Flex
        direction="column"
        align="center"
        bg="green.100"
        p={2}
        width="40px"
        borderRadius={4}
      >
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "238114" : "green.300"}
          fontSize={22}
          onClick={(event) => onVote(event, post, 1, postIdx)}
          cursor="pointer"
        />
        <Text fontSize="9pt">{post.voteStatus}</Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? "238114" : "green.300"}
          fontSize={22}
          onClick={(event) => onVote(event, post, -1, postIdx)}
          cursor="pointer"
        />
      </Flex>

      <Flex direction={"column"} width="100%">
        <Stack spacing={1} p="10px 20px 10px 20px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
            <Text>
              Posted by {post.creatorDisplayName}{" "}
              {post && post.createdAt && post.createdAt.seconds
                ? moment(new Date(post.createdAt.seconds * 1000)).fromNow()
                : "loading..."}
            </Text>
          </Stack>
          <Text fontSize="12pt" fontWeight={600}>
            {post.title}
          </Text>
          <Text>{post.body}</Text>
          {post.imageURL && (
            <Flex justify="center" align="center">
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                // width="80%"
                // maxWidth="500px"
                maxHeight="460px"
                src={post.imageURL}
                // borderRadius={4}
                borderColor={"green.500"}
                display={loadingImage ? "none" : {}}
                onLoad={() => setLoadingImage(false)}
                alt="Post Image"
                border="1px solid"
              />
            </Flex>
          )}
        </Stack>

        <Flex ml={2} mb={0.5} color="green.400">
          {/*Comment*/}
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "#BCCC71" }}
            cursor="pointer"
            //onClick={onCreateComment}
          >
            <Icon as={IoChatbubbleOutline} mr={2} />
            <Text fontSize="9pt"> {post.numberOfComments} </Text>
          </Flex>

          {/*Edit*/}
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "#BCCC71" }}
              cursor="pointer"
              onClick={(event) => onEditPost(event, post.id)}
            >
              <Icon as={FaRegEdit} mr={2} />
              <Text fontSize="9pt"> Edit </Text>
            </Flex>
          )}

          {/*Delete*/}
          {userIsCreator && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "#BCCC71" }}
              cursor="pointer"
              onClick={handleDelete}
            >
              <Icon as={AiOutlineDelete} mr={2} />
              <Text fontSize="9pt"> Delete </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default postItem;

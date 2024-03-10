import { Comment } from "@/atoms/CommentsAtom";
import { Box, Flex, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import moment from "moment";
import { NextRouter } from "next/router";
import React from "react";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
} from "react-icons/io5";

// export type Comment = {
//   id: string;
//   creatorId: string;
//   creatorDisplayText: string;
//   postId: string;
//   postTitle: string;
//   text: string;
//   createdAt: Timestamp;
// };

type CommentItemProps = {
  comment: Comment;
  userIsCreator: boolean;
  userCommentVoteValue?: number;
  router?: NextRouter;
  commentIdx?: string;
  onVoteComment: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    comment: Comment,
    commentVote: number,
    commentIdx?: string
  ) => void;
  onEditComment: (comment: Comment) => void;
  onDeleteComment: (comment: Comment) => void;
  loadingDelete: boolean;
  userId: string;
};

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  commentIdx,
  userCommentVoteValue,
  onVoteComment,
  onEditComment,
  onDeleteComment,
  loadingDelete,
  userId,
}) => {
  return (
    <Box borderRadius="0px 0px 4px 4px" bg={"#D9D9D9"}>
      <Flex m="5px 5px 5px 5px">
        <Box m="20px 10px 20px 5px">
          <Icon as={FaReddit} fontSize={30} color="black" />
        </Box>
        <Stack spacing={1} justifyContent="center">
          <Stack direction="row" spacing={2} fontSize="8pt">
            <Text
              fontWeight={700}
              _hover={{ textDecoration: "underline", cursor: "pointer" }}
            >
              {comment.creatorDisplayText}
            </Text>

            {comment.createdAt?.seconds && (
              <Text color="gray.600">
                {moment(new Date(comment.createdAt?.seconds * 1000)).fromNow()}
              </Text>
            )}
            {loadingDelete && <Spinner size="sm" />}
          </Stack>

          {/*Box display the input text*/}
          <Box maxWidth="fit-content">
            <Text fontSize="10pt">{comment.text}</Text>
          </Box>

          <Stack
            direction="row"
            align="center"
            cursor="pointer"
            fontWeight={600}
            color="black"
          >
            <Icon
              as={
                userCommentVoteValue === 1
                  ? IoArrowUpCircleSharp
                  : IoArrowUpCircleOutline
              }
              color={userCommentVoteValue === 1 ? "238114" : "green.300"}
              fontSize={22}
              onClick={(event) => onVoteComment(event, comment, 1)}
              cursor="pointer"
            />
            <Text fontSize="9pt">{comment.commentVoteStatus}</Text>
            <Icon
              as={
                userCommentVoteValue === -1
                  ? IoArrowDownCircleSharp
                  : IoArrowDownCircleOutline
              }
              color={userCommentVoteValue === -1 ? "238114" : "green.300"}
              fontSize={22}
              onClick={(event) => onVoteComment(event, comment, -1)}
              cursor="pointer"
            />

            {userId === comment.creatorId && (
              <>
                <Text
                  fontSize="9pt"
                  _hover={{ color: "blue.500" }}
                  onClick={() => onDeleteComment(comment)}
                >
                  Delete
                </Text>
              </>
            )}
          </Stack>
        </Stack>
      </Flex>
    </Box>
  );
};
export default CommentItem;

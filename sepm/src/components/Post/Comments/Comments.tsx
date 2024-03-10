import {
  Box,
  Flex,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  Timestamp,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { Comment, commentState, commentVote } from "@/atoms/CommentsAtom";
//  import { Comment } from "./CommentItem.tsx"

import { Post, postState } from "@/atoms/PostAtom";
import { authModalState } from "@/atoms/authModalAtoms";
import { firestore } from "@/firebase/clientApp";
import { useRecoilState, useSetRecoilState } from "recoil";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
//import CommentInput from "./ CommentInput";

type CommentsProps = {
  user: User;
  selectedPost: Post | null;
};

const Comments: React.FC<CommentsProps> = ({ user, selectedPost }) => {
  const [comment, setCommentText] = useState("");
  const [commentsVal, setCommentsVal] = useRecoilState(commentState);
  // const [comments, setComments] = useState<Comment[]>([]);
  const [commentFetchLoading, setCommentFetchLoading] = useState(true);
  const [commentCreateLoading, setCommentCreateLoading] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState("");
  const setAuthModalState = useSetRecoilState(authModalState);
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async () => {
    setCommentCreateLoading(true);
    try {
      const batch = writeBatch(firestore);

      // create a comment document
      const commentDocRef = doc(collection(firestore, "comments"));

      const newComment: Comment = {
        id: commentDocRef.id,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        //creatorDisplayText:user.displayName!,
        postId: selectedPost?.id!,
        commentVoteStatus: 0,
        // postTitle: selectedPost?.title!,
        text: comment,
        createdAt: serverTimestamp() as Timestamp,
      };

      // const CommentVote ={
      //   id: string;
      //   commentId: string;
      //   commentVoteValue: number;
      // }

      batch.set(commentDocRef, newComment);

      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      // update post numberOfComments + 1
      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(postDocRef, {
        numberOfComments: increment(1),
      });

      await batch.commit();

      // update client recoil state
      setCommentText("");
      //const { id: postId, title } = selectedPost;
      // setCommentsVal((prev) => [newComment, ...prev]);
      setCommentsVal((prev) => ({
        ...prev,
        comments: [newComment, ...prev.comments],
      }));

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
        //postUpdateRequired: true,
      }));
    } catch (error) {
      console.log("onCreateComment error", error);
    }
    setCommentCreateLoading(false);
  };

  const onEditComment = async (comment: Comment) => {};

  const onDeleteComment = async (comment: Comment) => {
    setLoadingDeleteId(comment.id as string);
    try {
      const batch = writeBatch(firestore);

      // delete a comment document
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      // update post numberOfComments - 1
      const postDocRef = doc(firestore, "posts", selectedPost?.id!);
      batch.update(doc(firestore, "posts", comment.postId), {
        numberOfComments: increment(-1),
      });

      await batch.commit();

      // update client recoil state
      if (!comment.id) throw "Comment has no ID";

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
        postUpdateRequired: true,
      }));

      // setCommentsVal((prev) => prev.filter((item) => item.id !== comment.id));
      setCommentsVal((prev) => ({
        ...prev,
        comments: prev.comments.filter((item) => item.id !== comment.id),
      }));

      // return true;
    } catch (error: any) {
      console.log("Error delete comment", error.message);
      // return false
    }
    setLoadingDeleteId("");
  };

  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // setCommentsVal(comments as Comment[]);
      setCommentsVal((prev) => ({
        ...prev,
        comments: comments as Comment[],
      }));
    } catch (error) {
      console.log("getPostComments error", error);
    }
    setCommentFetchLoading(false);
  };

  const onVoteComment = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    comment: Comment,
    newVoteVal: number
    // commentIdx?: string
  ) => {
    event.stopPropagation();
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    if (!selectedPost) return;

    try {
      // Get the current commentVotes
      const { commentVoteStatus } = comment;

      // logic is similar to onVotePost
      const commentBuffer = { ...comment };
      const listOfComments = [...commentsVal.comments];
      let userVotedComments = [...commentsVal.commentVotes];
      let voteChange = newVoteVal;
      const voteRef = doc(firestore, "comments", comment.id);

      await runTransaction(firestore, async (transaction) => {
        const commentVoteCollection = collection(
          firestore,
          "users",
          `${user?.uid}/commentVotes`
        );
        const commentVoteRef = doc(commentVoteCollection);

        // Checking if the user has voted on the comment before
        const getExistingVote = query(
          commentVoteCollection,
          where("commentID", "==", comment.id)
        );
        // Finding user's commentVotes
        const isExistingVote = await getDocs(getExistingVote);
        // case if empty:
        if (isExistingVote.empty) {
          // Create new vote document for them
          const newVote: commentVote = {
            id: commentVoteRef.id,
            commentID: comment.id,
            postID: selectedPost.id,
            commentVoteValue: newVoteVal, //1 or -1
          };
          console.log("NEW COMMENT VOTE!", newVote);

          //Working with updatedcomment (as a main variable to update the comment document)
          // add/substract 1 to/from the commentBuffer.commentVoteStatus
          commentBuffer.commentVoteStatus = newVoteVal + commentVoteStatus;
          commentBuffer.userVoteValue = newVoteVal;
          console.log("COMMENT BUFFER", commentBuffer);
          userVotedComments = [...userVotedComments, newVote];
          // Update the comment document
          transaction.set(commentVoteRef, newVote);
        }
        //Existing vote
        else {
          // Either user had a vote -> switching between or just removing their current vote
          // This section is only interacting with the user vote document only

          // Working with current vote data
          const existingVote = isExistingVote.docs[0].id;
          const voteSelection = isExistingVote.docs[0].data().commentVoteValue;

          const commentVoteRef = doc(
            firestore,
            "users",
            `${user.uid}/commentVotes/${existingVote}`
          );

          console.info("EXISTING VOTE");
          console.table("CURRENT VOTE VALUE", voteSelection);

          //1. Removing their vote (up => neutral OR down => neutral)
          if (voteSelection === newVoteVal) {
            commentBuffer.commentVoteStatus = commentVoteStatus - newVoteVal;
            // For updating the button on UI
            commentBuffer.userVoteValue = 0;
            // Finding id to remove from the commentVotes
            userVotedComments = userVotedComments.filter(
              (item) => item.id !== existingVote
            );

            // Delete the commentVote document
            transaction.delete(commentVoteRef); //voteChange*= -1;
          } else {
            voteChange = 2 * newVoteVal; // either 2 or -2
            commentBuffer.commentVoteStatus = commentVoteStatus + voteChange;

            // Finding the existing vote document to update the data
            const voteIdx = userVotedComments.findIndex(
              (item) => item.id === existingVote
            );
            console.log("CommentIdx: ", voteIdx);

            // If the vote is found, update the vote value
            if (voteIdx !== -1) {
              console.info("The vote is legit and it can be flipped");
              // User vote document update
              userVotedComments[voteIdx] = {
                ...userVotedComments[voteIdx],
                commentVoteValue: newVoteVal,
              };
            }
            // Updating state of the arrow
            if (voteChange > 0) {
              commentBuffer.userVoteValue = 1;
            } else if (voteChange < 0) {
              commentBuffer.userVoteValue = -1;
            }

            // Update the commentVote document (for the user)
            transaction.update(commentVoteRef, {
              commentVoteValue: newVoteVal,
            });
          }
        }
        // Updating the comment document
        const commentIdx = commentsVal.comments.findIndex(
          (item) => item.id === comment.id
        );
        // Updating state of the comment
        listOfComments[commentIdx] = commentBuffer;
        setCommentsVal((prev) => ({
          ...prev,
          comments: listOfComments,
          commentVotes: userVotedComments,
        }));
        // setCommentsVal((prev) => ({
        //   ...prev,
        //   selectedComment:
        // }));

        // Final update of the comment document
        transaction.update(voteRef, {
          commentVoteStatus: commentBuffer.commentVoteStatus,
        });
      });
    } catch (error) {
      console.log("onVoteComment error", error);
    }
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
  }, [selectedPost]);

  return (
    <Box borderRadius="0px 0px 4px 4px">
      <Flex direction="column" mt="10px" mb="15px" fontSize="10pt" width="100%">
        {!commentFetchLoading && (
          <CommentInput
            commentText={comment}
            setCommentText={setCommentText}
            user={user}
            createLoading={commentCreateLoading}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>

      <Stack spacing="10px">
        {commentFetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {commentsVal.comments.length === 0 ? (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>

            ) : (
              <>
                {commentsVal.comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onVoteComment={onVoteComment}
                    onEditComment={onEditComment}
                    onDeleteComment={onDeleteComment}
                    loadingDelete={loadingDeleteId === comment.id}
                    userId={user?.uid}
                    userIsCreator={user?.uid === comment.creatorId}
                  />
                ))}
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;

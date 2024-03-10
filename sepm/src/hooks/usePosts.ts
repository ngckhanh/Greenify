// React
import { useEffect, useState } from "react";

// Firestore
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";

// Storage
import { deleteObject, ref } from "firebase/storage";

// Recoil
import { authModalState } from "@/atoms/authModalAtoms";
import { auth, firestore, storage } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Post, PostVote, postState } from "../atoms/PostAtom";

const usePosts = () => {
  // Define hooks & global state here
  const [user] = useAuthState(auth);
  const [postVal, setPostVal] = useRecoilState(postState);
  // deb
  const Router = useRouter();
  // const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const setAuthModalState = useSetRecoilState(authModalState);
  // Define schema here

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>();

  const [input, setInput] = useState({
    title: "",
    tag: "",
    body: "",
  });

  const onTextChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };
  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    newVoteVal: number
    // postIdx?: string
  ) => {
    event.stopPropagation();
    // Check for the user => if not, open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const { voteStatus } = post;

    console.log("debug: finding postvotes - ", postVal.postVotes);

    try {
      const updatedPost = { ...post };
      const updatedPosts = [...postVal.posts];
      let updatedPostVotes = [...postVal.postVotes];

      let voteChange = newVoteVal;

      const postRef = doc(firestore, "posts", post.id);

      // using transaction to update the post document
      await runTransaction(firestore, async (transaction) => {
        // PREREQUISTE: Working with the postVote of a user (subcollection)
        const postVoteRef = doc(
          collection(firestore, "users", `${user?.uid}/postVotes`)
        );
        // Checking if the user has voted on the post before
        const getExistingVote = query(
          collection(firestore, "users", `${user?.uid}/postVotes`),
          where("postID", "==", post.id)
        );
        // Finding user's postVotes
        const existingVote = await getDocs(getExistingVote);
        if (existingVote.empty) {
          const newVote: PostVote = {
            id: postVoteRef.id,
            postID: post.id,
            voteValue: newVoteVal, // 1 or -1
          };

          console.log("NEW VOTE!!!", newVote);

          //Working with updatedPost (as a main variable to update the post document)
          // add/substract 1 to/from the post.voteStatus
          updatedPost.voteStatus = voteStatus + newVoteVal;
          updatedPost.userVoteValue = newVoteVal;
          updatedPostVotes = [...updatedPostVotes, newVote];
          // add the new vote to our postVotes.
          transaction.set(postVoteRef, newVote);
        }

        // Existing vote
        else {
          // Variable to perform necessary changes to the post document
          // VoteID: using voteID to find existing user vote in postVotes
          // currentVoteValue: shows the current vote value of the user (1 or -1)
          const voteID = existingVote.docs[0].id;
          const currentVoteValue = existingVote.docs[0].data().voteValue;

          // PREREQUISTE: Working with the voteID (postVotes subcollection)
          const postVoteRef = doc(
            firestore,
            "users",
            `${user?.uid}/postVotes/${voteID}`
          );

          console.log("currentVoteValue: ", currentVoteValue);
          console.log("EXISTING VOTE!!!");

          //1. Removing their vote (up => neutral OR down => neutral)
          if (currentVoteValue === newVoteVal) {
            // add/ substract 1 to/from post.votedSatus -> updatedPost
            updatedPost.voteStatus = voteStatus - newVoteVal; //remove vote back to the neutral.
            updatedPost.userVoteValue = 0;

            // Finding id to remove from the postVotes
            updatedPostVotes = updatedPostVotes.filter(
              (vote) => vote.id !== voteID
            );

            // delete the postVote document
            transaction.delete(postVoteRef);
            // voteChange *= -1;
          }

          //Flipping their vote (up => down OR down => up)
          else {
            // add/ substract 2 to/from post.votedSatus
            voteChange = 2 * newVoteVal;
            updatedPost.voteStatus = voteStatus + voteChange;

            // finding the existing vote in our postVotes (number of votes)
            const voteIdx = updatedPostVotes.findIndex(
              (vote) => vote.id === voteID
            );
            console.log("voteIdx: ", voteIdx);

            // If the vote is found, update the vote value
            if (voteIdx !== -1) {
              console.info(
                "This legit vote should be flipped from up to down or down to up"
              );
              // update the vote value
              updatedPostVotes[voteIdx] = {
                ...updatedPostVotes[voteIdx],
                voteValue: newVoteVal,
              };
            }
            // Updating state of the arrow
            if (voteChange === 2) {
              updatedPost.userVoteValue = 1;
            } else if (voteChange === -2) {
              updatedPost.userVoteValue = -1;
            }

            // finally, update the postVote document
            transaction.update(postVoteRef, { voteValue: newVoteVal });
          }
        }
        const postIdx = postVal.posts.findIndex((item) => item.id === post.id);
        updatedPosts[postIdx!] = updatedPost;
        // updating the state (nothing to do with firestore)
        setPostVal((prev) => ({
          ...prev,
          posts: updatedPosts,
          postVotes: updatedPostVotes,
        }));

        // For single post page
        console.log("updated post: ", updatedPost);
        setPostVal((prev) => ({
          ...prev,
          selectedPost: updatedPost,
          postVotes: updatedPostVotes,
          voteStatus: updatedPost.voteStatus,
        }));
        console.log("updated post vote: ", updatedPost.voteStatus);

        //update our post document in firestore
        transaction.update(postRef, { voteStatus: updatedPost.voteStatus });
        console.log("vote change: ", voteChange);
      });
    } catch (error) {
      console.log("onVote error", error);
    }
  };

  const onSelectPost = (post: Post) => {
    console.log("this is post content: ", post);
    // set selected post
    let id = post.id;

    setPostVal({
      ...postVal,
      selectedPost: { ...post, id },
    });
    // migrate user to post
    Router.push(`/comments/${post.id}`);
  };

  const onDelete = async (post: Post): Promise<boolean> => {
    try {
      console.log("delete post");

      // delete post from firestore (using promise)
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      // delete post from firestore (using promise)
      const postRef = doc(firestore, "posts", post.id);
      await deleteDoc(postRef);

      setPostVal({
        ...postVal,
        selectedPost: null,
      });

      // Update the whole post list
      const updatedPosts = postVal.posts.filter((item) => item.id !== post.id);
      setPostVal((prev) => ({
        ...prev,
        posts: updatedPosts,
      }));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  useEffect(() => {
    if (!user) {
      //Clear user post votes
      setPostVal((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user]);

  return { postVal, setPostVal, onVote, onSelectPost, onDelete };
};
export default usePosts;

import { Post } from "@/atoms/PostAtom";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "../Post/PostItem/PostItem";
import PostLoader from "../Elements/Loader";
import EditForm from "../Post/EditForm";

type UserPostsProps = {
  userId?: string;
  // loadingUser: boolean
};
const UserPosts: React.FC<UserPostsProps> = ({
  userId,
  // loadingUser
}) => {
  const [loading, setLoading] = React.useState(false);
  const { postVal, setPostVal, onVote, onDelete, onSelectPost } = usePosts();
  const [user] = useAuthState(auth);
  const [editMode, setEditMode] = React.useState(false);
  const fetchPosts = async () => {
    setLoading(true);
    try {
      if (user) {
        const postQuery = await query(
          collection(firestore, "posts"),
          where("creatorId", "==", user.uid)
        );
        //query the posts collection in firestore and order them by createdAt

        //get the post docs from firestore
        const postDocs = await getDocs(postQuery);

        //map through the postDocs and return the data of each post
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        //store posts fetched from firestore in postStateValue
        setPostVal((prev) => ({ ...prev, posts: posts as Post[] }));
        console.log("post:", posts);
      }
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  const selectPost = (post: Post) => {
    console.log("this is post content: ", post);
    // set selected post
    let id = post.id;

    setPostVal((prev) => ({
      ...prev,
      selectedPost: { ...post, id },
    }));
  };

  const onEditPost = (event: React.MouseEvent, postId: string) => {
    event.stopPropagation();
    const foundPost = postVal.posts.find((post) => post.id === postId);

    if (foundPost) {
      selectPost(foundPost);
      setEditMode(true);
    } else {
      console.error(`Post with ID ${postId} not found`);
    }
  };
  useEffect(() => {
    console.log("fetching posts...");
    fetchPosts();
  }, []);
  console.log("postStateValue:", postVal);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : editMode ? (
        // Render EditForm when in edit mode
        //@ts-ignore
        <EditForm user={user!} selectedPost={postVal.selectedPost} />
      ) : (
        <Stack>
          {postVal.posts.map((item) => (
            <PostItem
              key={item.id}
              post={item}
              //pass the post data to the PostItem component
              userIsCreator={user?.uid === item.creatorId}
              //the logic above is used to check if the user is the creator of the post
              //@ts-ignore
              userVoteValue={item.userVoteValue}
              //the logic above is used to check if the user has voted for the post
              onVote={onVote}
              //onVote is used to update the voteStatus of the post

              //onEditPost is used to edit the post
              onEditPost={onEditPost}
              //onDeletePost is used to delete the post
              onDeletePost={onDelete}
              //onSelectPost is used to select the post which is clicked by the user
              onSelectPost={onSelectPost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};

export default UserPosts;

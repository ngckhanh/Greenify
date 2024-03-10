import { Post } from "@/atoms/PostAtom";
import { auth, firestore } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import { Stack, Text } from "@chakra-ui/react";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import router from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import EditForm from "./EditForm";
import PostItem from "./PostItem/PostItem";
import PostLoader from "./PostLoader";
// Import necessary date-related functions

type PostsProps = {
  userId?: string;
  queryingTag: string;
  queryingTitle: string;
  queryingDateFilter: string;
  // loadingUser: boolean
};
const Posts: React.FC<PostsProps> = ({
  userId,
  queryingTag,
  queryingTitle,
  queryingDateFilter,
  // loadingUser
}) => {
  const [loading, setLoading] = React.useState(false);
  const { postVal, setPostVal, onVote, onDelete, onSelectPost } = usePosts();
  const [postsCache, setPostsCache] = React.useState(postVal);
  const [user] = useAuthState(auth);
  // const [refresh, setRefresh] = React.useState(false);
  const [notFound, setNotFound] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchUserVote = (id: string) => {
        const countUserVote = async () => {
          console.log("fetching user vote...");
          // query the votes collection in firestore
          const voteQuery = query(
            collection(firestore, `users/${user?.uid}/postVotes`)
          );
          //get the vote docs from firestore
          const voteDocs = await getDocs(voteQuery);
          // only return the vote value if the post id is match
          const vote = voteDocs.docs.filter((doc) => doc.data().postID === id);
          if (vote.length === 0) return 0;
          console.log("vote value: ", vote[0].data().voteValue);
          return vote[0].data().voteValue;
        };
        const userVote = countUserVote();

        // convert the userVote to number
        return userVote;
      };

      const postQuery = query(collection(firestore, "posts"));
      //query the posts collection in firestore and order them by createdAt

      //get the post docs from firestore
      const postDocs = await getDocs(postQuery);

      //map through the postDocs and return the data of each post
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const finalPosts = posts.map((post) => ({
        ...post,
        userVoteValue: 0,
      }));

      // fetch the userVoteValue for each post
      if (user) {
        for (let post of finalPosts) {
          post.userVoteValue = await fetchUserVote(post.id);
        }
      }

      // append the posts with the userVoteValue

      //store posts fetched from firestore in postStateValue
      setPostVal((prev) => ({ ...prev, posts: finalPosts as Post[] }));
      // also store the posts in the cache
      setPostsCache((prev) => ({ ...prev, posts: finalPosts as Post[] }));
      console.log("postCache length: ", postsCache.posts.length);
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPostsById = async (postId: string) => {
    // ... (your existing fetchPostsById logic)
    const { pid } = router.query;
    setLoading(true);
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDocSnap = await getDoc(postDocRef);

      if (postDocSnap.exists()) {
        const post = {
          id: postDocSnap.id,
          ...postDocSnap.data(),
        };

        setPostVal((prev) => ({ ...prev, posts: [post] as Post[] }));
        setNotFound(false);
      } else {
        setNotFound(true);
        setPostVal((prev) => ({ ...prev, posts: [] }));
      }
    } catch (error: any) {
      console.error("Error fetching post by ID", error.message);
    }
    setLoading(false);
  };

  const handlePostClick = (postId: string) => {
    // Call fetchPostsById to get the details of the clicked post
    fetchPostsById(postId);
  };

  //qq
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

  const selectPost = (post: Post) => {
    console.log("this is post content: ", post);
    // set selected post
    let id = post.id;

    setPostVal((prev) => ({
      ...prev,
      selectedPost: { ...post, id },
    }));
  };

  useEffect(() => {
    // Look for the tag in the database
    // If it exists, filter the posts by the tag
    if (queryingTag === undefined || queryingTag === "") {
      fetchPosts();
      setNotFound(false);
    } else {
      // fetch posts with the available posts data
      for (let i = 0; i < postsCache.posts.length; i++) {
        // if the tag is found, set the posts to the posts with the tag
        if (postsCache.posts[i].tag == queryingTag) {
          setPostVal((prev) => ({
            ...prev,
            posts: [postsCache.posts[i]],
          }));
          setNotFound(false);
          break;
        } else {
          // else if (postVal.posts[i].tag !== queryingTag){
          // if the tag is not found, set the posts to an empty array
          setNotFound(true);
          setPostVal((prev) => ({
            ...prev,
            posts: [],
          }));
        }
      }
    }
    setLoading(false);
    console.log("not found: ", notFound);
  }, [queryingTag]);

  useEffect(() => {
    // Look for the title in the database
    // If it exists, filter the posts by the title
    if (queryingTitle === undefined || queryingTitle === "") {
      fetchPosts();
      setNotFound(false);
    } else {
      console.log("This got called in queryingTitle");
      // fetch posts with the available posts data
      for (let i = 0; i < postsCache.posts.length; i++) {
        // if the title is found, set the posts to the posts with the title
        if (postsCache.posts[i].title == queryingTitle) {
          setPostVal((prev) => ({
            ...prev,
            posts: [postVal.posts[i]],
          }));
          setNotFound(false);
          break;
        } else {
          setNotFound(true);
          // if the title is not found, set the posts to an empty array
          setPostVal((prev) => ({
            ...prev,
            posts: [],
          }));
          continue;
        }
      }
      setLoading(false);
      console.log("not found: ", notFound);
    }
    setLoading(false);
  }, [queryingTitle]);

  const fetchPostsByDate = async (startDate: Timestamp, endDate: Timestamp) => {
    setLoading(true);
    try {
      const postsRef = collection(firestore, "posts");
      const dateFilteredPostsQuery = query(
        postsRef,
        where("createdAt", ">=", startDate),
        where("createdAt", "<=", endDate)
      );
      const postDocs = await getDocs(dateFilteredPostsQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostVal((prev) => ({ ...prev, posts: posts as Post[] }));
    } catch (error: any) {
      console.log("Error fetching posts by date", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    // setNotFound(true);
    // Apply the selected date filter to filter the posts by the specified date range
    if (queryingDateFilter === "1Day") {
      // Logic to filter posts created within the last 24 hours
      // Fetch posts created within the last 24 hours
      const today = new Date();
      const startOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0
      );
      const endOfToday = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59
      );
      fetchPostsByDate(
        Timestamp.fromDate(startOfToday),
        Timestamp.fromDate(endOfToday)
      );
    } else if (queryingDateFilter === "1Week") {
      // Logic to filter posts created within the last 7 days
      // Fetch posts created within the last 7 days
      const today = new Date();
      const startOfThisWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay(),
        0,
        0,
        0
      );
      const endOfThisWeek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - today.getDay() + 6,
        23,
        59,
        59
      );
      fetchPostsByDate(
        Timestamp.fromDate(startOfThisWeek),
        Timestamp.fromDate(endOfThisWeek)
      );
    } else if (queryingDateFilter === "1Month") {
      // Logic to filter posts created within the last 30 days
      // Fetch posts created within the last 30 days
      const today = new Date();
      const startOfThisMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
        0,
        0,
        0
      );
      const endOfThisMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59
      );
      fetchPostsByDate(
        Timestamp.fromDate(startOfThisMonth),
        Timestamp.fromDate(endOfThisMonth)
      );
    } else {
      // If no date filter is selected, fetch all posts
      fetchPosts();
    }
  }, [queryingDateFilter]);

  /*
  In this modified code, the notFound state will only appear under the specified conditions:
  When the search of the post title is not found.
  When the filter of the post date is not found.
  When the filter of the post tags is not found.
  When any combination of the above conditions is met.*/
  /*
    useEffect(() => {
    setNotFound(
      (queryingTitle && !postVal.posts.some(post => post.title === queryingTitle)) ||
      (queryingDateFilter && !postVal.posts.some(post => post.date === queryingDateFilter)) ||
      (queryingTag && !postVal.posts.some(post => post.tags.includes(queryingTag)))
    );
  }, [queryingDateFilter, queryingTag, queryingTitle, postVal.posts]);
  
  */

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
          {notFound && <Text>Oops, no post found!</Text>}
        </Stack>
      )}
    </>
  );
};

export default Posts;

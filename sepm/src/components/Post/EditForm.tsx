import { Post } from "@/atoms/PostAtom";
import { firestore, storage } from "@/firebase/clientApp";
import usePosts from "@/hooks/usePosts";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  useToast,
  Heading,
  Input,
  Link,
  Select,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  Timestamp,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import ImageUpload from "../Elements/ImageUpload";
import { toast, ToastContentProps } from 'react-toastify';

type EditFormProps = {
  user: User;
  selectedPost: Post | null;
};

const EditForm: React.FC<EditFormProps> = ({ user, selectedPost }) => {
  const router = useRouter();
  const { postVal, setPostVal, onSelectPost, onDelete, onVote } = usePosts();

  //const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //const [error, setError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userError, setUserError] = useState("");

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (e) => {
      setSelectedFile(e.target?.result as string);
    };
  };
  //On selecting an image, we convert it to base64 format and store it in selectedFile state

  const selectFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string>();

  const [editForm, setEditForm] = useState({
    title: "",
    tag: "empty",
    body: "",
    //photoURL:"",
  });

  const toast = useToast();

  const fetchPost = async () => {
    // query pid
    const { pid } = router.query;
    // loading will be implemented later
    // setLoading(true);

    // fetch post
    try {
      const PostRef = doc(firestore, "posts", pid as string);
      const postResult = await getDoc(PostRef);

      //console.log("postResult: ", postResult.data());

      if (postResult.exists()) {
        const post = {
          id: postResult.id,
          ...postResult.data(),
        };

        setPostVal((prev) => ({
          ...prev,
          selectedPost: post as Post,
        }));
      } else {
        console.error(`Post with ID ${pid} not found`);
      }
    } catch (error: any) {
      console.error("Error fetching post by ID", error.message);
    }
  };

  // check if user is accessing this page directly
  // useEffect(() => {
  //   // log why this useEffect is triggered
  //   console.log("DetailPost useEffect triggered");
  //   console.log("router.query: ", router.query);

  //   const { pid } = router.query;

  //   if (!pid) return;

  //   // if the poststate is not set, fetch the post
  //   if (pid && !postVal.selectedPost) {
  //     fetchPost();
  //     console.log("fetching post...");
  //   }
  // }, [router.query]);
  // console.log("API check: ", postVal.selectedPost);

  useEffect(() => {
    if (!selectedPost) {
      return;
    }
    setEditForm({
      title: selectedPost.title,
      tag: selectedPost.tag,
      body: selectedPost.body,
    });
  }, [selectedPost]);

  const updatePostDetailAndDocument = async () => {
    const { id } = selectedPost as Post;
    console.log("this got called");

    // post id is either from the url or from the selectedPost
    const { pid } = router.query;

    if (!pid && !id) {
      console.error("Post ID not found");
      return;
    }

    const postDocRef = id
      ? doc(firestore, "posts", id as string)
      : doc(firestore, "posts", pid as string);

    try {
      //setIsLoading(true);
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const imageURL = await getDownloadURL(imageRef);
      }

      await updateDoc(postDocRef, {
        title: editForm.title,
        body: editForm.body,
        tag: editForm.tag,
        timestamp: serverTimestamp() as Timestamp,
      });
      console.log("Post updated 1");

      setIsLoading(false);
      console.log("Update post successfully");

      const currentRoute = router.asPath;
      if (currentRoute === "/forum") {
        router.push(`/comments/${postDocRef.id}`);
      } else if (currentRoute === `/comments/${postDocRef.id}`) {
        //router.push("/forum");
        router.push(`/comments/${postDocRef.id}`);
      } 
    } catch (error: any) {
      setError(error);
      console.log("Error updating post", error.message);
      setIsLoading(false);
    }
    //redirect user to post page
    // router.back();qq
  };

  
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      console.log("%c Update post", "color: green; font-size: 1.2rem");
      setIsLoading(true);
      await updatePostDetailAndDocument();
  
      // If the promise is resolved (no error), show the success toast
      toast({
        title: 'Edit Post.',
        description: 'Your post has been successfully editing.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
  
      // Other logic if needed after the successful update
    } catch (error: any) {
      setError(error);
      console.log("Error editing post", error.message);
      setIsLoading(false); // Set isLoading to false in case of an error
    }
  };

  const onTextChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    //update form state
    setEditForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    console.log("editForm.title:", editForm);
  };

  return (
      <form onSubmit={onSubmit}>
      <Box
          p="20px 40px 20px 40px"
          borderBottom="1px solid"
          bg="white"
          borderRadius={4}
          width="full"
      >
        <Heading as="h3" size="2xl" pt="10px">
          Edit Post
        </Heading>

        <Flex direction={"column"} mt={5} rounded="md" width={"full"}>
        <Stack spacing={3} width="100%">
          <FormControl isRequired>
            <FormLabel as="b">Post title</FormLabel>
            <Input
              name="title"
              value={editForm.title}
              onChange={onTextChange}
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              fontSize="10pt"
              borderRadius={4}
              placeholder="Title"
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel> Tag</FormLabel>
            <Select
              _placeholder={{ color: "gray.500" }}
              name="tag"
              value={editForm.tag}
              onChange={onTextChange}
            >
              <option value="">Select a tag</option>
              <option value="Air Pollution">Air Pollution</option>
              <option value="Water Contamination">Water Contamination</option>
              <option value="Soil Contamination">Soil Contamination</option>
              <option value="Plastic Pollution">Plastic Pollution</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel> Contents</FormLabel>
            <Textarea
              name="body"
              value={editForm.body}
              onChange={onTextChange}
              fontSize="10pt"
              placeholder="Text (optional)"
              _placeholder={{ color: "gray.500" }}
              _focus={{
                outline: "none",
                bg: "white",
                border: "1px solid",
                borderColor: "black",
              }}
              height="100px"
            />
          </FormControl>
        </Stack>

        {/*  */}
        <ImageUpload
          selectedFile={selectedFile}
          onSelectImage={onSelectImage}
          setSelectedFile={setSelectedFile}
          selectFileRef={selectFileRef}
        />

        <Flex justify="flex-end" mt="20px">
          <ButtonGroup variant="outline" spacing="15px">
            <Flex>
              <Button
                isLoading={isLoading}
                type="submit"
                loadingText="Submitting"
                size="md"
                height="34px"
                padding="0px 30px"
                variant="solid"
                _hover={{ bg: "green.200" }}
                disabled={!editForm.title}
              >
                Edit
              </Button>
            </Flex>

            <Link href="/forum">
              <Button
                colorScheme="teal"
                variant="outline"
                size="md"
                height="34px"
                padding="0px 30px"
                _hover={{ bg: "green.100" }}
              >
                Cancel
              </Button>
            </Link>
          </ButtonGroup>
        </Flex>
        {error && (
          <Alert status="error" mt="20px">
            <AlertIcon />
            <AlertTitle>
              Error editing post. Please check all of your data, and make sure
              all of the information is correct.
            </AlertTitle>
          </Alert>
        )}
      </Flex>



      </Box>
      
    </form>
  );
};
export default EditForm;

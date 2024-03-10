import { Post } from "@/atoms/PostAtom";
import { firestore, storage } from "@/firebase/clientApp";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Link,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import router from "next/router";
import React, { useRef, useState } from "react";
import ImageUpload from "../Elements/ImageUpload";
import TextInputProps from "../Elements/TextInputs";

type PostFormProps = {
  user: User;
};

//4./*  */
//Include the type of user in the PostFormProps
//We use User type from firebase auth to get the user
const PostForm: React.FC<PostFormProps> = ({ user }) => {
  //3.
  //We get the user from props
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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

  const handlePost = async () => {
    // random string for image related to post
    // console.log(id);
    //create new post object => type Post
    //@ts-ignore
    const newPost: Post = {
      // id: "",
      creatorId: user?.uid,
      creatorDisplayName: user.email!.split("@")[0],
      title: input.title,
      tag: input.tag,
      body: input.body,
      numberOfComments: 0,
      voteStatus: 0,
      createdAt: serverTimestamp() as Timestamp,
    };
    //6.
    setLoading(true);

    try {
      //7.
      //store post in firestore => get postDocRef
      const postDocRef = await addDoc(collection(firestore, "posts"), newPost);

      //Check for selectedFile
      if (selectedFile) {
        //8.
        //store in storage => getDownloadURL(return imageURL)
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        //This is the reference to the image in the storage
        //postDocRef.id is the id of the post doc in firestore
        //image is the name of the image in the storage
        //This is the path to the image in the storage

        await uploadString(imageRef, selectedFile, "data_url");
        //This uploads the image to the storage
        //selectedFile is the image in base64 format
        //data_url is the format of the image

        const imageURL = await getDownloadURL(imageRef);
        //This gets the downloadURL of the image from the storage

        //8.
        //Update post doc by adding imageURL
        await updateDoc(postDocRef, { imageURL });
        //This updates the post doc in firestore by adding imageURL
        //postDocRef is the reference to the post doc in firestore
        //imageURL is the downloadURL of the image
      }
    } catch (error: any) {
      console.log("Error creating post", error.message);
      setError(true);
    }
    setLoading(false);
    //9.
    //redirect user to post page
    router.back();
  };

  return (
    <Box
      p="20px 40px 20px 40px"
      borderBottom="1px solid"
      bg="white"
      borderRadius={4}
      width="full"
    >
      <Heading as="h3" size="2xl" pt="10px">
        Create Post
      </Heading>

      <Flex direction={"column"} mt={5} rounded="md" width={"full"}>
        <TextInputProps textInputs={input} onChange={onTextChange} />
        <ImageUpload
          selectedFile={selectedFile}
          onSelectImage={onSelectImage}
          setSelectedFile={setSelectedFile}
          selectFileRef={selectFileRef}
        />
        <Flex justify="flex-end" mt="20px">
          <ButtonGroup variant="outline" spacing="15px">
            <Button
              onClick={handlePost}
              isLoading={loading}
              loadingText="Submitting"
              size="md"
              height="34px"
              padding="0px 30px"
              variant="solid"
              _hover={{ bg: "green.200" }}
              disabled={!input.title}
            >
              Submit
            </Button>

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
            <AlertTitle>Error submitting post</AlertTitle>
          </Alert>
        )}
      </Flex>
    </Box>
  );
};

export default PostForm;

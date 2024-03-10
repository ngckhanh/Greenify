import { firestore, storage } from "@/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/firebase/error";
import {
  Button,
  Center,
  Flex,
  FormControl,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { getAuth, updateProfile } from "firebase/auth";
import { Timestamp, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRef, useState } from "react";
import { BsEmojiSunglasses } from "react-icons/bs";
import { CiCircleCheck } from "react-icons/ci";
import UserImage from "../Elements/UserImage";

const EditProfile: React.FC = () => {
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
  const [success, setSuccess] = useState(false);
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string>();

  const [EditForm, setEditForm] = useState({
    displayName: "",
    photoURL: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const toast = useToast();

  const updateUserProfileAndDocument = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    // Initialize imageURL with the current photoURL

    if (user !== null) {
      const userDocRef = doc(firestore, "users", user.uid);
      let imageURL = user.photoURL ? user.photoURL : "";
      try {
        if (selectedFile) {
          const imageRef = ref(storage, `users/${userDocRef.id}`);
          await uploadString(imageRef, selectedFile, "data_url");
          imageURL = await getDownloadURL(imageRef); // Update imageURL if selectedFile is truthy
        }

        await updateProfile(user, {
          displayName: EditForm.displayName,
          photoURL: imageURL,
        });
        console.log(user.displayName);
        await updateDoc(userDocRef, {
          photoURL: imageURL,
          displayName: EditForm.displayName,
          timestamp: serverTimestamp() as Timestamp,
        });

        // Display the toast notification here
        toast({
          title: "Profile updated.",
          description: "Successfully edited",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        console.log(user);
        setIsLoading(false);
        console.log("Profile updated successfully");
        setSuccess(true);
      } catch (authError: Error | any) {
        setAuthError(authError);
        console.log("Error updating user", authError.message);
        setIsLoading(true);
      }
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setIsLoading(true);

      await updateUserProfileAndDocument();
    } catch (error) {
      console.log("Error updating user", authError.message);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //update form state
    setEditForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        {success ? (
          <Flex
            direction="column"
            alignItems="center"
            width="100%"
            as={Stack}
            spacing={2}
            mb="20px"
          >
            <Icon as={CiCircleCheck} color="green.400" fontSize={80} />
            <Heading color="green.400">Success!</Heading>
            <Text textAlign="center" color="green.300" fontSize="10pt">
              Profile updated successfully
            </Text>
          </Flex>
        ) : (
          <Stack spacing={3} direction={["column"]}>
            <Center mb="2px">
              {/* <Heading as="h4" size="lg" pt="10px" >
              Edit Profile
            </Heading> */}
              <Text fontWeight={700} mb={2}>
                Update your profile
              </Text>
              <UserImage
                selectedFile={selectedFile}
                onSelectImage={onSelectImage}
                setSelectedFile={setSelectedFile}
                selectFileRef={selectFileRef}
              />
            </Center>

            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<BsEmojiSunglasses color="gray.300" />}
                />
                <Input
                  required
                  name="displayName"
                  placeholder="username"
                  type="text"
                  mb={2}
                  onChange={onChange}
                  fontSize="10pt"
                  _placeholder={{ color: "gray.500" }}
                  _hover={{
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                  }}
                  _focus={{
                    ouline: "none",
                    bg: "white",
                    border: "1px solid",
                    borderColor: "blue.500",
                  }}
                  bg="gray.50"
                />
              </InputGroup>
            </FormControl>

            <Text textAlign="center" color="red" fontSize="10pt" hidden>
              {
                FIREBASE_ERRORS[
                  authError?.message as keyof typeof FIREBASE_ERRORS
                ]
              }
            </Text>

            <Stack spacing={3} direction={["column", "row"]}>
              <Button
                w="full"
                type="submit"
                isLoading={isLoading}
                _hover={{
                  bg: "green.200",
                }}
                mb="20px"
              >
                Submit
              </Button>
            </Stack>
          </Stack>
        )}
      </form>
    </>
  );
};
export default EditProfile;

import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { auth, firestore } from "@/firebase/clientApp";
import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Link,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Stack,
  keyframes,
  useColorModeValue,
} from "@chakra-ui/react";
import { User, getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import EditProfileForm from "./EditProfile";

type ProfileProps = {
  user: User;
};

const Profile: React.FC<ProfileProps> = () => {
  const firstFieldRef = React.useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);
  const size = "96px";
  const color = "teal";
  const pulseRing = keyframes`
	0% {
    transform: scale(0.33);
  }
  40%,
  50% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }`;
  const [loading, setLoading] = React.useState(false);
  const initRef = React.useRef();
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
  });

  const fetchUser = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      // Initialize imageURL with the current photoURL

      if (user !== null) {
        const userDocRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          console.log("User document data:", userDoc.data());
          // Update the state or perform other actions with the user document data
          setUserData({
            displayName: userDoc.data().displayName,
            email: userDoc.data().email,
            photoURL: userDoc.data().photoURL,
          });

          console.log("usestate work!!");
        } else {
          console.log("User document does not exist");
        }
      }
    } catch (error: any) {
      console.log("fetchUser error", error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    console.log("fetching users...");
    fetchUser();
  }, [user !== null]);

  return (
    <Box
      maxW={"400px"}
      w={"full"}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"2xl"}
      rounded={"md"}
      overflow={"hidden"}
    >
      {userData && (
        <>
          <Box h={"100px"} objectFit="cover" w="500px" bg="green.300" />
          <Flex justify={"start"} mb="-50px">
            <Box
              as="div"
              position="relative"
              top="-50px"
              right="-30px"
              w={size}
              h={size}
              _before={{
                content: "''",
                position: "relative",
                display: "block",
                width: "300%",
                height: "300%",
                boxSizing: "border-box",
                left: "-92px",
                top: "-93px",
                borderRadius: "full",
                bgColor: color,
                animation: `2.25s ${pulseRing} cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite`,
              }}
            />
            <Avatar
              src={userData.photoURL}
              mt={-12}
              ml={8}
              borderRadius="full"
              border="2px solid teal"
              size={"xl"}
              position={"relative"}
              left={-24}
            />
          </Flex>

          <Box p={6} pt={2}>
            {/* <Stack spacing={6} direction={'row'} justifyContent={'space-between'}> */}
            <Stack
              spacing={6}
              align={"start"}
              direction={"row"}
              mb={5}
              justifyContent={"space-between"}
            >
              <Stack mt={2} w={200}>
                <Heading fontSize={"xl"} fontWeight={500} fontFamily={"body"}>
                  {userData.displayName}
                </Heading>
              </Stack>

              <Popover
                isOpen={isOpen}
                initialFocusRef={firstFieldRef}
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                placement="bottom-end"
                closeOnBlur={false}
              >
                <PopoverTrigger>
                  <IconButton
                    variant="outline"
                    colorScheme="teal"
                    aria-label="Send email"
                    icon={<EditIcon />}
                    _hover={{ bg: "RGBA(0, 0, 0, 0.04)" }}
                  />
                </PopoverTrigger>

                <PopoverContent
                  w={"max-content"}
                  rounded={"xl"}
                  bg="white"
                  boxShadow={"lg"}
                  p={6}
                >
                  <PopoverCloseButton
                    position="relative"
                    left="482px"
                    top="32px"
                  />
                  <EditProfileForm />
                  <Button
                    variant={"outline"}
                    w="full"
                    onClick={(onclose) => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </PopoverContent>
              </Popover>
            </Stack>

            {/* </Stack> */}

            <Link href="/post/submit">
              <Button
                w={"full"}
                justifyContent={"center"}
                bg={"green.400"}
                color={"white"}
                rounded={"md"}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
              >
                Add post
              </Button>
            </Link>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Profile;

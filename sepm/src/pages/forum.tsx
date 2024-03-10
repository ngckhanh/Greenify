import ForumContent from "@/components/Layout/ForumContent";
import Posts from "@/components/Post/Posts";
import SearchInput from "@/components/Post/SearchInput";
import Profile from "@/components/Profile/Profile";
import { auth } from "@/firebase/clientApp";
import { Button, Flex, HStack, Link, Select, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtoms";
import { useRouter } from "next/router";



const ProfilePage: React.FC = () => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();


  const handleCreatePostClick = () => {
    // Check if the user is authenticated
    if (!user?.uid) {
      // If not authenticated, display the login modal
      setAuthModalState({ open: true, view: "login" });
      return;
    } else {
      // Navigate to the post creation page
      router.push("/post/submit");
    }
  };

  // a state for handling current Tag filter
  const [tag, setTag] = React.useState("");
  // METHOD 1: get state from the select component
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.info("The current tag: ", event.target.value);
    setTag(event.target.value);
  };

  // a state for handling Search title
  const [searchTitle, setSearchTitle] = React.useState("");
  //METHOD 2.
  const handleSearchByTitle = (title: string) => {
    setSearchTitle(title);
  };

  // State for Date Filter selection
  const [dateFilter, setDateFilter] = React.useState("");
  const handleDateFilter = (selectedFilter: string) => {
    setDateFilter(selectedFilter);
  };

  useEffect(() => {
    // console.log("The current date filter: ", dateFilter);
    // Apply the selected date filter to filter the posts by date range
    // Logic to filter posts based on the selected date range (less than 1 day, 1 week, 1 month)
  }, [dateFilter]);
  useEffect(() => {
    // Look for the tag in the database and filter the posts by the tag
    // If they exist, filter the posts by the tag
  }, [tag]);

  useEffect(() => {
    // console.log("The current search title: ", searchTitle);
    // Look for the search title in the database and filter the posts by the title
    // If they exist, filter the posts by search title
  }, [searchTitle]);

  return (
    <ForumContent>
      <>
        {/* Dropdown working path */}
        <Flex mb={5}>
          <HStack direction="row" spacing={4} alignItems="center">
            <HStack>
                <Button
                  w={"full"}
                  justifyContent={"center"}
                  bg={"green.400"}
                  color={"white"}
                  rounded={"md"}
                  _hover={{
                    bg:"green.400",
                    boxShadow: "lg",
                  }}
                  onClick={handleCreatePostClick}
                >
                  Create a Post
                </Button>
            </HStack>

            <HStack>
              <SearchInput onSearch={handleSearchByTitle} />
            </HStack>

            <HStack>
              <Text mr="2px" fontWeight={600} alignSelf={"center"}>
                Filter:
              </Text>

              <Select
                width="50%"
                placeholder="By Tags:"
                border={"1px solid black"}
                onChange={handleChange}
              >
                <option value="Air Pollution">Air Pollution</option>
                <option value="Water Contamination">Water Contamination</option>
                <option value="Soil Contamination">Soil Contamination</option>
                <option value="Plastic Pollution">Plastic Pollution</option>
              </Select>
              <Select
                width="50%"
                placeholder="By Date:"
                border={"1px solid black"}
                onChange={(event) => handleDateFilter(event.target.value)}
              >
                <option value="1Day">Today</option>
                <option value="1Week">Past 7 Days</option>
                <option value="1Month">Past 30 Days</option>
              </Select>
            </HStack>
          </HStack>
        </Flex>
        {
          <Posts
            userId={user?.uid}
            queryingTag={tag}
            queryingTitle={searchTitle}
            queryingDateFilter={dateFilter}
          />
        }
      </>
      {user && <Profile user={user} />}
    </ForumContent>
  );
};

export default ProfilePage;

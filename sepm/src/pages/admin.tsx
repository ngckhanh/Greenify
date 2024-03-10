import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Link,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/clientApp";

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import AdminPage from "@/components/Layout/AdminPage";
import Loader from "@/components/Elements/Loader";
import { GreenActsEvent } from "@/atoms/eventAtoms";
import useEvent from "@/hooks/useEvents";
import EventAdmin from "@/components/Event/EventAdmin";
import NotFound from "../components/Elements/NotFound";
import LoadingPage from "../components/Elements/LoadingPage";
import withAuth from "@/utils/withAuth";

type adminProps = {};

const admin: React.FC<adminProps> = () => {
  const [user, loading, error] = useAuthState(auth);
  const [admin, setAdmin] = useState(false);
  const [checkRole, setCheckRole] = useState(false);
  const [comments, setComments] = useState(0);
  const [users, setUsers] = useState(0);
  const [posts, setPosts] = useState(0);
  const [events, setEvents] = useState(0);
  const fetchDataFromFirestore = async () => {
    const usersCollectionRef = collection(firestore, "users");
    const querySnapshotUsers = await getDocs(usersCollectionRef);

    await querySnapshotUsers.forEach((doc) => {
      if (doc.data().role == "admin" && doc.data().uid == user?.uid) {
        setAdmin(true);
      }
    });

    const postsCollectionRef = collection(firestore, "posts");
    const querySnapshotPosts = await getDocs(postsCollectionRef);

    const commentsCollectionRef = collection(firestore, "comments");
    const querySnapshotComments = await getDocs(commentsCollectionRef);

    const eventsCollectionRef = collection(firestore, "GreenActs");
    const querySnapshotEvents = await getDocs(eventsCollectionRef);

    // Create an array to accumulate the new pins

    const postsSize = await querySnapshotPosts.size;
    const usersSize = await querySnapshotUsers.size;
    const commentsSize = await querySnapshotComments.size;
    const eventsSize = await querySnapshotEvents.size;

    // console.log(count);
    // // Update the pins state outside the loop with all the collected pins
    setPosts(postsSize);
    setUsers(usersSize);
    setComments(commentsSize);
    setEvents(eventsSize);
    await setCheckRole(true);
  };
  useEffect(() => {
    fetchDataFromFirestore();
  }, [user]);

  const [load, setLoading] = React.useState(false);
  const { eventVal, setEventVal, onSelectEvent } = useEvent();
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const eventQuery = query(collection(firestore, "GreenActs"));
      //query the posts collection in firestore and order them by createdAt

      //get the event docs from firestore
      const eventDocs = await getDocs(eventQuery);

      //map through the postDocs and return the data of each event
      const events = eventDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const finalEvents = events.map((event) => ({
        ...event,
      }));
      console.log("finalEvents", finalEvents);
      //store posts fetched from firestore in postStateValue
      setEventVal((prev) => ({
        ...prev,
        events: finalEvents as GreenActsEvent[],
      }));
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDataFromFirestore();
    fetchEvents();
  }, []);

  if (checkRole == true) {
    return (
      <>
        {admin == true ? (
          <AdminPage>
            <>
              <Flex
                direction="column"
                justifyItems={"center"}
                alignContent={"center"}
              >
                <Flex justify={"center"}>
                  <Text fontSize="25px" fontWeight="bold">
                    Admin dashboard
                  </Text>
                </Flex>

                <Flex justify="center">
                  <Box
                    width="100%"
                    //height={"100vh"}
                    bg="white"
                    borderRadius={"10px"}
                    marginTop={"10px"}
                    marginBottom={"10px"}
                    paddingBottom={"10px"}
                  >
                    <Flex>
                      <Text
                        marginLeft="30px"
                        marginTop="10px"
                        fontWeight="bold"
                        marginBottom={"10px"}
                      >
                        Overview
                      </Text>
                    </Flex>
                    <Flex justify="center">
                      <Table
                        marginLeft="30px"
                        marginRight={"30px"}
                        borderRadius="10px"
                        bg="#ECF2D9"
                        height={"150px"}
                      >
                        <Tbody>
                          <Tr>
                            <Td
                              width="25%"
                              borderRight="1px"
                              borderColor="gray.300"
                              borderBottom="0px"
                              verticalAlign="top"
                            >
                              <Text fontWeight="bold" marginBottom="10px">
                                Users
                              </Text>
                              <Text fontWeight="semibold" textColor={"#FF3D3C"}>
                                {users}
                              </Text>
                            </Td>
                            <Td
                              width="25%"
                              borderRight="1px"
                              borderColor="gray.300"
                              borderBottom="0px"
                              verticalAlign="top"
                            >
                              <Text fontWeight="bold" marginBottom="10px">
                                Posts
                              </Text>
                              <Text fontWeight="semibold" textColor={"#FF3D3C"}>
                                {posts}
                              </Text>
                            </Td>
                            <Td
                              width="25%"
                              borderRight="1px"
                              borderColor="gray.300"
                              borderBottom="0px"
                              verticalAlign="top"
                            >
                              <Text fontWeight="bold" marginBottom="10px">
                                Comments
                              </Text>
                              <Text fontWeight="semibold" textColor={"#FF3D3C"}>
                                {comments}
                              </Text>
                            </Td>
                            <Td
                              width="25%"
                              borderBottom="0px"
                              verticalAlign="top"
                            >
                              <Text fontWeight="bold" marginBottom="10px">
                                GreenAct's Event
                              </Text>
                              <Text fontWeight="semibold" textColor={"#FF3D3C"}>
                                {events}
                              </Text>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </Flex>

                    <Flex direction="row" alignItems="center" marginTop="20px">
                      <Flex marginLeft="30px">
                        <Text fontWeight="bold">Pins:</Text>
                      </Flex>
                      <Flex>
                        <Link href="/DeletePins">
                          <Button
                            color="white"
                            marginLeft="30px"
                            //padding="0px 30px"
                            variant="solid"
                            _hover={{ bg: "green.200" }}
                          >
                            Delete Pins
                          </Button>
                        </Link>
                      </Flex>

                      <Flex marginLeft="30px">
                        <Text fontWeight="bold">Events:</Text>
                      </Flex>
                      <Flex>
                        <Link href="/event/createEvent">
                          <Button
                            color="white"
                            marginLeft="30px"
                            //padding="0px 30px"
                            variant="solid"
                            _hover={{ bg: "green.200" }}
                          >
                            Create Event
                          </Button>
                        </Link>
                      </Flex>
                    </Flex>
                  </Box>
                </Flex>

                <Flex marginBottom={"10px"}>
                  <Text marginLeft="30px" marginTop="10px" fontWeight="bold">
                    Recently created events
                  </Text>
                </Flex>
                <Flex alignItems={"center"} justifyContent={"center"} w="full">
                  {load ? (
                    <Loader />
                  ) : (
                    <Stack spacing={1}>
                      {eventVal.events.map((item) => (
                        <EventAdmin
                          event={item}
                          //pass the post data to the PostItem component
                          title={item.title}
                          days={item.days}
                          image={item.image}
                          onSelectEvent={onSelectEvent}
                          //onSelectPost is used to select the post which is clicked by the user
                          // event,
                        />
                      ))}
                      {/* {notFound() && <Text>Oops, no post found!</Text>} */}
                    </Stack>
                  )}
                </Flex>
              </Flex>
            </>
            <Box />
          </AdminPage>
        ) : (
          <NotFound />
        )}
      </>
    );
  } else {
    return <LoadingPage />;
  }
};
export default withAuth(admin);

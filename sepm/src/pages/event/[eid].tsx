import { GreenActsEvent } from "@/atoms/eventAtoms";
import Loader from "@/components/Elements/Loader";
import EventItem from "@/components/Event/EventItem";
import EventContentPage from "@/components/Layout/EventContentPage";
import { firestore } from "@/firebase/clientApp";
import useEvent from "@/hooks/useEvents";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Link, Stack, Text } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

type EventDetailsProps = {
  event: GreenActsEvent;
  title: string;
  days: string;
  image: string;
  description: string;
  location: string;
  onSelectEvent: (event: GreenActsEvent, id: string) => void;
};

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onSelectEvent,
}) => {
  const [loading, setLoading] = React.useState(false);
  const { eventVal, setEventVal } = useEvent();
  const router = useRouter();

  const fetchEventDetails = async () => {
    setLoading(true);
    const { eid } = router.query;
    try {
      //query the posts collection in firestore and order them by createdAt
      if (event !== null) {
        const eventDocRef = doc(firestore, "GreenActs", eid as string);
        //get the event docs from firestore
        const eventDocs = await getDoc(eventDocRef);
        console.log("eventDocs", eventDocs.data());
        setEventVal({
          ...eventVal,
          selectedEvent: {
            ...eventDocs.data(),
            id: eventDocRef.id,
          } as GreenActsEvent,
        });
      } else {
        console.log("Event does not exist");
      }
    } catch (error: any) {
      console.log("fetchEventDetails error", error.message);
    }
  };
  useEffect(() => {
    // log why this useEffect is triggered
    console.log("DetailEvent useEffect triggered");
    console.log("router.query: ", router.query);
    const { eid } = router.query;
    console.log("pid: ", eid);

    if (!eid) return;

    // if the poststate is not set, fetch the post
    if (eid && !eventVal.selectedEvent) {
      fetchEventDetails();
      console.log("fetching event...");
    }
  }, [router.query]);
  console.log("API check: ", eventVal.selectedEvent);

  return (
    <EventContentPage>
      <>
      <Box width="full">
          <Flex direction={"row"} alignItems={"center"} mb="10px">
            <Link href="/greenActs">
              <IconButton
                aria-label="Return page"
                variant="outline"
                colorScheme="teal"
                _hover={{ bg: "#0F3320", color: "white" }}
                icon={<ArrowBackIcon />}
                mr="7px"
                w={8}
                h={8}
              />
            </Link>
            <Text fontSize="sm">Return back to GreenActs</Text>

          </Flex>

          <Stack>
            {loading ? (
              <Loader />
            ) : (
              <Stack>
                {eventVal.selectedEvent && (
                  <EventItem
                    event={eventVal.selectedEvent}
                    //pass the post data to the PostItem component
                    title={eventVal.selectedEvent.title}
                    days={eventVal.selectedEvent.days}
                    image={eventVal.selectedEvent.image}
                    location={eventVal.selectedEvent.location}
                    description={eventVal.selectedEvent.description}
                    onSelectEvent={onSelectEvent}
                    //onSelectPost is used to select the post which is clicked by the user
                    // event,
                  />
                )}
                {/* {notFound() && <Text>Oops, no post found!</Text>} */}
              </Stack>
            )}
          </Stack>
        </Box>
        </>
        <Box />
    </EventContentPage>

    
  );
};

export default EventDetails;

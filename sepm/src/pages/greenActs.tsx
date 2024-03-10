import { GreenActsEvent } from "@/atoms/eventAtoms";
import Loader from "@/components/Elements/Loader";
import EventItem from "@/components/Event/EventItem";
import { firestore } from "@/firebase/clientApp";
import useEvent from "@/hooks/useEvents";
import { Box, Stack } from "@chakra-ui/react";
import { collection, getDocs, query } from "firebase/firestore";
import React, { useEffect } from "react";
import EventCard from "@/components/Event/EventCard";
import EventContentPage from "@/components/Layout/EventContentPage";
const GreenActs = () => {
  const [loading, setLoading] = React.useState(false);
  const { eventVal, setEventVal, onSelectEvent } = useEvent();
  // fetch events - useEffect + function
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
    fetchEvents();
  }, []);

  return (
    <EventContentPage>
      <>
      <Box width="full">
        <Stack
          spacing={10}
        >
        {loading ? (
          <Loader />
        ) : (
          <Stack>
            {eventVal.events.map((item) => (
              <EventCard
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
        </Stack>
      </Box>
      </>
      <Box/>
    </EventContentPage>
  );
};
export default GreenActs;

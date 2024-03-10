// React
import { useEffect } from "react";

// Recoil
import { GreenActsEvent, eventState } from "@/atoms/eventAtoms";
import { auth } from "@/firebase/clientApp";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";

const useEvent = () => {
  // Define hooks & global state here
  const [user] = useAuthState(auth);
  const [eventVal, setEventVal] = useRecoilState(eventState);
  // deb
  const Router = useRouter();

  const onSelectEvent = (event: GreenActsEvent) => {
    console.log("this is event content: ", event);
    // set selected event
    let id = event.id;

    setEventVal({
      ...eventVal,
      selectedEvent: { ...event, id },
    });
    // migrate user to event
    Router.push(`/event/${event.id}`);
  };

  useEffect(() => {
    if (!user) {
      //Clear user event votes
      setEventVal((prev) => ({
        ...prev,
      }));
    }
  }, [user]);

  return { eventVal, setEventVal, onSelectEvent };
};
export default useEvent;

import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

// create a list of accepted event tags
export type GreenActsEvent = {
  id: string;
  days: string;
  time: string;
  description: string;
  title: string;
  image: string;
  createdAt: Timestamp;
  location: string;
};

export type EventVote = {
  id: string;
  eventID: string;
};

interface EventState {
  selectedEvent: GreenActsEvent | null;
  events: GreenActsEvent[];
}

export const eventInitialState: EventState = {
  selectedEvent: null,
  events: [],
};

export const eventState = atom<EventState>({
  key: "eventState",
  default: eventInitialState,
});


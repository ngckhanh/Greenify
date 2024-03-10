import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

export type Comment = {
  id: string;
  postId: string;
  creatorId: string;
  creatorDisplayText: string;
  commentVoteStatus: number;
  createdAt: Timestamp;
  userVoteValue?: number;
  text: string;
};

export type commentVote = {
  id: string;
  commentID: string;
  postID: string;
  commentVoteValue: number;
};

interface commentState {
  selectedComment: Comment | null;
  comments: Comment[];
  commentVotes: commentVote[];
}

export const commentInitialState: commentState = {
  selectedComment: null,
  comments: [],
  commentVotes: [],
};

export const commentState = atom<commentState>({
  key: "commentState",
  default: commentInitialState,
});

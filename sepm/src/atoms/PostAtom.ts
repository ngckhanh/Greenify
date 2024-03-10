import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";

// create a list of accepted post tags
export const postTags = [
  "general",
  "news",
  "discussion",
  "question",
  "suggestion",
  "bug",
  "other",
];

export type updatePost = {
  postId: string,
  tag: string | (typeof postTags)[number];
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  imageURL: string;
};
export type Post = {
  id: string;
  tag: string | (typeof postTags)[number];
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL: string;
  createdAt: Timestamp;
  userVoteValue?: number;
};

export type PostVote = {
  id: string;
  postID: string;
  voteValue: number;
};

interface PostState {
  selectedPost: Post | null;
  posts: Post[];
  postVotes: PostVote[];
}

export const postInitialState: PostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const postState = atom<PostState>({
  key: "postState",
  default: postInitialState,
});

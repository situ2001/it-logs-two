import { Tweet, User } from "@prisma/client";

export type ReturningTweet = Tweet & { author: User };

export type TweetError = {
  message: string;
};

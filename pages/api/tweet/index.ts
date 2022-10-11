import { Relation } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { ReturningTweet, TweetError } from "../../../types/api";
import { options } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetError | ReturningTweet | ReturningTweet[]>
) {
  const session = await unstable_getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const user = await prisma.user.findFirst({
    where: { name: session?.user?.name, email: session?.user?.email },
    select: { relationAsInvitee: true, relationAsinviter: true, id: true },
  });

  if (user) {
    let relation: Relation | null = null;
    // choose 1 in 2
    if (user.relationAsInvitee && !user.relationAsinviter) {
      relation = user.relationAsInvitee;
    } else if (!user.relationAsInvitee && user.relationAsinviter) {
      relation = user.relationAsinviter;
    }

    if (relation) {
      // Things happen there
      if (req.method === "GET") {
        const tweets = await prisma.tweet.findMany({
          where: {
            relation,
          },
          include: {
            author: true,
          },
          orderBy: {
            createAt: "desc",
          },
        });

        res.status(200).json(tweets);
      } else if (req.method === "POST") {
        // check id and content
        const { content } = req.body;
        if (content === undefined) {
          res.status(500).json({ message: "Please provide content" });
          return;
        }
        const tweet = await prisma.tweet.create({
          data: {
            content,
            relation: { connect: { id: relation.id } },
            author: { connect: { id: user.id } },
          },
          include: {
            author: true,
          },
        });

        res.status(200).json(tweet);
      } else {
        res.status(405).json({ message: "Unsupported HTTP method" });
      }
    } else {
      res.status(404).json({ message: "Please join a relation first" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
}

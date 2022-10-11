import { Prisma, Relation } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/prisma";
import { ReturningTweet, TweetError } from "../../../types/api";
import { options } from "../auth/[...nextauth]";

/**
 * RESTFul DELETE, PUT, GET
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TweetError | ReturningTweet | Prisma.BatchPayload>
) {
  const session = await unstable_getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  let { id } = req.query;
  id = id?.toString();

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
        const tweets = await prisma.tweet.findFirst({
          where: {
            relation,
            id,
          },
          include: {
            author: true,
          },
        });
        if (tweets) {
          res.status(200).json(tweets);
        } else {
          res.status(404).json({ message: "Record not found" });
        }
      } else if (req.method === "PUT") {
        const { content } = req.body;
        if (content === undefined) {
          res.status(204).json({ message: "No content provided" });
          return;
        }

        // TODO may optimize this invocation
        const result = await prisma.tweet.updateMany({
          where: { id, relation },
          data: {
            content,
          },
        });
        if (result.count === 0) {
          res.status(404).json({ message: "Record not found" });
        } else {
          res.status(200).json(result);
        }
      } else if (req.method === "DELETE") {
        const result = await prisma.tweet.deleteMany({
          where: {
            id,
            relation,
          },
        });
        if (result.count === 0) {
          res.status(404).json({ message: "Record not found" });
        } else {
          res.status(200).json(result);
        }
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

import { Relation } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../lib/prisma";
import { options } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = await unstable_getServerSession(req, res, options);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const user = await prisma.user.findFirst({
    where: { name: session?.user?.name, email: session?.user?.email },
    select: { relationAsInvitee: true, relationAsinviter: true },
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
      if (req.method === "GET") {
        const tweets = await prisma.tweet.findMany({
          where: {
            relation,
          },
          select: {
            // id: true,
            createAt: true,
            editAt: true,
            content: true,
            author: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createAt: "desc",
          },
        });

        res.status(200).json(tweets);
      }
    } else {
      res.status(404).json({ message: "Please join a relation first" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
}

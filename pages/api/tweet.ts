import { Tweet } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
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
  });
  if (user) {
    const relation = await prisma.relation.findFirst({
      where: { OR: [{ inviteeUser: user }, { inviterUser: user }] },
    });
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
        return;
      }
    }
  }

  res.status(404).json({ message: "Not found" });
  return;
}

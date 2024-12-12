import { getServerSession } from "auth";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "POST") {
    const { name, summary, link, keywords } = req.body;

    try {
      const project = await prisma.project.create({
        data: {
          name,
          summary,
          link,
          creator: { connect: { id: session.user.id } },
          keywords: { connect: keywords.map((id) => ({ id })) },
        },
      });

      res.status(201).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating project" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

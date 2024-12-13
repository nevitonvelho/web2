import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, summary, link, keywords, createdBy } = body;

    if (!name || !summary || !link || !keywords || !createdBy) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        summary,
        link,
        createdBy,
        keywords: {
          connectOrCreate: keywords.map((keyword: string) => ({
            where: { name: keyword },
            create: { name: keyword },
          })),
        },
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    return NextResponse.json({ error: "Erro ao criar o projeto." }, { status: 500 });
  }
}

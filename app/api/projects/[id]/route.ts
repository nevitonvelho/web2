import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = parseInt(params.id, 10);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "ID do projeto inválido." }, { status: 400 });
    }

    const session = await auth();
    const userId = Number(session?.user?.id);

    if (!session || !userId) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        keywords: true,
        developers: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar projeto:", error);
    return NextResponse.json({ error: "Erro ao buscar o projeto." }, { status: 500 });
  }
}

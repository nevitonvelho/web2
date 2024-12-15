import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = parseInt(params.id, 10);
    const { name, summary, link, keywords } = await req.json();

    if (!name || !summary || !link || isNaN(projectId)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    // Verifica se o usuário é o criador ou desenvolvedor do projeto
    const session = await auth();
    const userId = Number(session?.user?.id);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { developers: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
    }

    const isAuthorized =
      project.createdBy === userId || project.developers.some((dev) => dev.id === userId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Permissão negada." }, { status: 403 });
    }

    // Atualiza o projeto
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        summary,
        link,
        keywords: {
          connectOrCreate: keywords.map((keyword: string) => ({
            where: { name: keyword },
            create: { name: keyword },
          })),
        },
      },
    });

    return NextResponse.json({ updatedProject }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error);
    return NextResponse.json({ error: "Erro ao atualizar o projeto." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } | null }
) {
  if (!params || !params.id) {
    return NextResponse.json({ error: "ID do projeto não fornecido." }, { status: 400 });
  }

  try {
    const projectId = parseInt(params.id, 10);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: "ID do projeto inválido." }, { status: 400 });
    }

    const { name, summary, link, keywords } = await req.json();

    if (!name || !summary || !link) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    // Continua com a lógica de autorização e atualização
    const session = await auth();
    const userId = Number(session?.user?.id);

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { developers: true, keywords: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
    }

    const isAuthorized =
      project.createdBy === userId || project.developers.some((dev) => dev.id === userId);

    if (!isAuthorized) {
      return NextResponse.json({ error: "Permissão negada." }, { status: 403 });
    }

    const existingKeywords = project.keywords.map((kw) => kw.name);
    const newKeywords = keywords.filter((kw: string) => !existingKeywords.includes(kw));
    const removedKeywords = existingKeywords.filter((kw) => !keywords.includes(kw));

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        summary,
        link,
        keywords: {
          connectOrCreate: newKeywords.map((keyword: string) => ({
            where: { name: keyword },
            create: { name: keyword },
          })),
          disconnect: removedKeywords.map((keyword: string) => ({
            name: keyword,
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

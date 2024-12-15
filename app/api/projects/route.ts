import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isUserProjects = searchParams.get("user") === "true";

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const userId = Number(session.user.id);

    if (isUserProjects) {
      // Retorna projetos vinculados ao usuário (criados ou onde ele é desenvolvedor)
      const projects = await prisma.project.findMany({
        where: {
          OR: [
            { createdBy: userId }, // Projetos criados pelo usuário
            { developers: { some: { id: userId } } }, // Projetos onde o usuário é desenvolvedor
          ],
        },
        include: {
          keywords: true, // Inclui palavras-chave associadas
        },
      });

      return NextResponse.json({ projects });
    } else {
      // Retorna todos os projetos (caso necessário em outro endpoint)
      const projects = await prisma.project.findMany({
        include: {
          keywords: true,
        },
      });

      return NextResponse.json({ projects });
    }
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    return NextResponse.json({ error: "Erro ao buscar projetos." }, { status: 500 });
  }
}

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

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const userId = Number(session.user.id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID do usuário inválido." }, { status: 400 });
    }

    const body = await req.json();
    const { id, name, summary, link, keywords } = body;

    if (!id) {
      return NextResponse.json({ error: "ID do projeto é obrigatório." }, { status: 400 });
    }

    const projectId = Number(id);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "ID do projeto inválido." }, { status: 400 });
    }

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
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

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

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID do projeto é obrigatório." }, { status: 400 });
    }

    const projectId = Number(id);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: "ID inválido." }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ message: "Projeto deletado com sucesso." }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar projeto:", error);
    return NextResponse.json({ error: "Erro ao deletar o projeto." }, { status: 500 });
  }
}

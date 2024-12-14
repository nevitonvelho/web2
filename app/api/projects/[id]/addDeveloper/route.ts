import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = parseInt(params.id, 10);
    const { userId } = await req.json();

    if (!userId || isNaN(projectId)) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    // Verifica se o projeto existe
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
    }

    // Adiciona o usuário como desenvolvedor
    await prisma.project.update({
      where: { id: projectId },
      data: {
        developers: {
          connect: { id: userId }, // Conecta o usuário ao projeto
        },
      },
    });

    return NextResponse.json({ message: "Desenvolvedor adicionado com sucesso." }, { status: 200 });
  } catch (error) {
    console.error("Erro ao adicionar desenvolvedor:", error);
    return NextResponse.json({ error: "Erro ao adicionar desenvolvedor." }, { status: 500 });
  }
}

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

    // Remove o usuário como desenvolvedor
    await prisma.project.update({
      where: { id: projectId },
      data: {
        developers: {
          disconnect: { id: userId }, // Desconecta o usuário do projeto
        },
      },
    });

    return NextResponse.json({ message: "Desenvolvedor removido com sucesso." }, { status: 200 });
  } catch (error) {
    console.error("Erro ao remover desenvolvedor:", error);
    return NextResponse.json({ error: "Erro ao remover desenvolvedor." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/auth";

// Lista os conhecimentos do usuário
export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const userKnowledge = await prisma.knowledgeOnUser.findMany({
      where: { userId },
      include: { knowledge: true },
    });

    return NextResponse.json(userKnowledge, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar conhecimentos do usuário:", error);
    return NextResponse.json({ error: "Erro ao buscar conhecimentos." }, { status: 500 });
  }
}

// Adiciona ou atualiza o nível de conhecimento do usuário
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { knowledgeId, level } = await req.json();
    if (!knowledgeId || level < 0 || level > 10) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const userId = Number(session.user.id);

    const updatedKnowledge = await prisma.knowledgeOnUser.upsert({
      where: { userId_knowledgeId: { userId, knowledgeId } },
      create: { userId, knowledgeId, level },
      update: { level },
    });

    return NextResponse.json(updatedKnowledge, { status: 200 });
  } catch (error) {
    console.error("Erro ao cadastrar conhecimento:", error);
    return NextResponse.json({ error: "Erro ao cadastrar conhecimento." }, { status: 500 });
  }
}

// Exclui o conhecimento do usuário
export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const { knowledgeId } = await req.json();
    if (!knowledgeId) {
      return NextResponse.json({ error: "ID do conhecimento é obrigatório." }, { status: 400 });
    }

    const userId = Number(session.user.id);

    await prisma.knowledgeOnUser.delete({
      where: { userId_knowledgeId: { userId, knowledgeId } },
    });

    return NextResponse.json({ message: "Conhecimento excluído com sucesso." }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir conhecimento:", error);
    return NextResponse.json({ error: "Erro ao excluir conhecimento." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Listar todos os conhecimentos
export async function GET() {
  try {
    const knowledge = await prisma.knowledge.findMany();
    return NextResponse.json(knowledge, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar conhecimentos:", error);
    return NextResponse.json({ error: "Erro ao buscar conhecimentos." }, { status: 500 });
  }
}

// Criar um novo conhecimento
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "O nome do conhecimento é obrigatório." }, { status: 400 });
    }

    const existingKnowledge = await prisma.knowledge.findUnique({
      where: { name },
    });

    if (existingKnowledge) {
      return NextResponse.json(
        { error: "Já existe um conhecimento com esse nome." },
        { status: 400 }
      );
    }

    const newKnowledge = await prisma.knowledge.create({
      data: { name },
    });

    return NextResponse.json(newKnowledge, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar conhecimento:", error);
    return NextResponse.json({ error: "Erro ao criar conhecimento." }, { status: 500 });
  }
}



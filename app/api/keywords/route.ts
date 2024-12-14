import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Listar todas as palavras-chave
export async function GET() {
  try {
    const keywords = await prisma.keyword.findMany();
    return NextResponse.json(keywords, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar palavras-chave:", error);
    return NextResponse.json({ error: "Erro ao buscar palavras-chave." }, { status: 500 });
  }
}

// Criar uma nova palavra-chave
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "O nome da palavra-chave é obrigatório." }, { status: 400 });
    }

    // Verifica se a palavra-chave já existe
    const existingKeyword = await prisma.keyword.findUnique({
      where: { name },
    });

    if (existingKeyword) {
      return NextResponse.json(
        { error: "Já existe uma palavra-chave com esse nome." },
        { status: 400 }
      );
    }

    const newKeyword = await prisma.keyword.create({
      data: { name },
    });

    return NextResponse.json(newKeyword, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar palavra-chave:", error);
    return NextResponse.json({ error: "Erro ao criar palavra-chave." }, { status: 500 });
  }
}



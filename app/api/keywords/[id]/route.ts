import { NextResponse } from "next/server";
import prisma from "@/lib/db";


// Atualizar uma palavra-chave por ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const keywordId = parseInt(params.id, 10);
      const { name } = await req.json();
  
      if (!keywordId || isNaN(keywordId)) {
        return NextResponse.json({ error: "ID inválido." }, { status: 400 });
      }
  
      if (!name || !name.trim()) {
        return NextResponse.json({ error: "O nome da palavra-chave é obrigatório." }, { status: 400 });
      }
  
      const updatedKeyword = await prisma.keyword.update({
        where: { id: keywordId },
        data: { name },
      });
  
      return NextResponse.json(updatedKeyword, { status: 200 });
    } catch (error) {
      console.error("Erro ao atualizar palavra-chave:", error);
      return NextResponse.json({ error: "Erro ao atualizar palavra-chave." }, { status: 500 });
    }
  }
  
  // Excluir uma palavra-chave por ID
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      const keywordId = parseInt(params.id, 10);
  
      if (!keywordId || isNaN(keywordId)) {
        return NextResponse.json({ error: "ID inválido." }, { status: 400 });
      }
  
      await prisma.keyword.delete({
        where: { id: keywordId },
      });
  
      return NextResponse.json({ message: "Palavra-chave excluída com sucesso." }, { status: 200 });
    } catch (error) {
      console.error("Erro ao excluir palavra-chave:", error);
      return NextResponse.json({ error: "Erro ao excluir palavra-chave." }, { status: 500 });
    }
  }
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Atualizar um conhecimento por ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const knowledgeId = parseInt(params.id, 10);
      const { name } = await req.json();
  
      if (!knowledgeId || isNaN(knowledgeId)) {
        return NextResponse.json({ error: "ID inválido." }, { status: 400 });
      }
  
      if (!name || !name.trim()) {
        return NextResponse.json({ error: "O nome do conhecimento é obrigatório." }, { status: 400 });
      }
  
      const updatedKnowledge = await prisma.knowledge.update({
        where: { id: knowledgeId },
        data: { name },
      });
  
      return NextResponse.json(updatedKnowledge, { status: 200 });
    } catch (error) {
      console.error("Erro ao atualizar conhecimento:", error);
      return NextResponse.json({ error: "Erro ao atualizar conhecimento." }, { status: 500 });
    }
  }
  
  // Excluir um conhecimento por ID
  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      const knowledgeId = parseInt(params.id, 10);
  
      if (!knowledgeId || isNaN(knowledgeId)) {
        return NextResponse.json({ error: "ID inválido." }, { status: 400 });
      }
  
      await prisma.knowledge.delete({
        where: { id: knowledgeId },
      });
  
      return NextResponse.json({ message: "Conhecimento excluído com sucesso." }, { status: 200 });
    } catch (error) {
      console.error("Erro ao excluir conhecimento:", error);
      return NextResponse.json({ error: "Erro ao excluir conhecimento." }, { status: 500 });
    }
  }
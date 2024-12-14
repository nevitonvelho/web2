import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // Consulta para obter o número de alunos que dominam cada conhecimento
    const knowledgeReport = await prisma.knowledge.findMany({
      include: {
        users: true,
      },
    });

    // Formata os dados para o frontend
    const formattedReport = knowledgeReport.map((knowledge) => ({
      id: knowledge.id,
      name: knowledge.name,
      count: knowledge.users.length, // Quantidade de alunos que dominam o conhecimento
    }));

    return NextResponse.json(formattedReport, { status: 200 });
  } catch (error) {
    console.error("Erro ao gerar relatório de conhecimentos:", error);
    return NextResponse.json({ error: "Erro ao gerar relatório." }, { status: 500 });
  }
}

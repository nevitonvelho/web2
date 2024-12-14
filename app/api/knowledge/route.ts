import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const knowledge = await prisma.knowledge.findMany();
    return NextResponse.json(knowledge, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar conhecimentos:", error);
    return NextResponse.json({ error: "Erro ao buscar conhecimentos." }, { status: 500 });
  }
}

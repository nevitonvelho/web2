import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

// Edita um usuário
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);
    const { name, email, password, role } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Campos obrigatórios não preenchidos." }, { status: 400 });
    }

    const data: any = { name, email, role };
    if (password) {
      data.password = bcrypt.hashSync(password, 10); // Atualiza a senha, se fornecida
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json({ error: "Erro ao atualizar usuário." }, { status: 500 });
  }
}

// Exclui um usuário
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = parseInt(params.id, 10);

    // Verifica se o usuário existe antes de excluir
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "Usuário excluído com sucesso." }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return NextResponse.json({ error: "Erro ao excluir usuário." }, { status: 500 });
  }
}

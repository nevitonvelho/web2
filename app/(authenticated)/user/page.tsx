"use client";

import ManageKnowledge from "@/app/components/ManageKnowledge";
import { signOut, useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return <p className="text-center text-gray-500">Carregando informações do usuário...</p>;
  }

  const { user } = session;

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Perfil do Usuário</h1>

      {/* Informações do usuário */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-100">
        <p><strong>ID:</strong> {user?.id || "N/A"}</p>
        <p><strong>Nome:</strong> {user?.name || "N/A"}</p>
        <p><strong>Email:</strong> {user?.email || "N/A"}</p>
      </div>

      {/* Botão de sair */}
      <button
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
      >
        Sair
      </button>

      {/* Gerenciamento de conhecimentos */}
      <ManageKnowledge />
    </div>
  );
}

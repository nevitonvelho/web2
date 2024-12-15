"use client";

import ManageKnowledge from "@/app/components/ManageKnowledge";
import { signOut, useSession } from "next-auth/react";
import { Button, Card } from "flowbite-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-500">Carregando informações do usuário...</p>
      </div>
    );
  }

  const { user } = session;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Perfil do Usuário</h1>

      {/* Informações do usuário */}
      <Card className="shadow-lg">
        <h2 className="text-xl font-semibold">Informações do Usuário</h2>
        <div className="space-y-2">
          <p>
            <strong>ID:</strong> {user?.id || "N/A"}
          </p>
          <p>
            <strong>Nome:</strong> {user?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || "N/A"}
          </p>
        </div>
        <Button
          color=""
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="mt-4 bg-red-500 text-white"
        >
          Sair
        </Button>
      </Card>

      {/* Gerenciamento de conhecimentos */}
      <Card className="shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Gerenciar Conhecimentos</h2>
        <ManageKnowledge />
      </Card>
    </div>
  );
}

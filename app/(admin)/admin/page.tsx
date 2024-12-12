"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redireciona para a página de login se o usuário não for autenticado ou não for ADMIN
    if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
      router.push("/admin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Carregando...</p>; // Exibe enquanto valida a sessão
  }

  return (
    <div>
      <h1>Página de Admin</h1>
      <p>Bem-vindo, {session.user.name}!</p>
    </div>
  );
}

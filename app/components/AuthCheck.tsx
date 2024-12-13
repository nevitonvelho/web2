"use client";

import { useSession } from "next-auth/react";

export default function AuthCheck() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    // Carregando a sessão
    return <p>Loading...</p>;
  }

  if (status === "authenticated") {
    // Usuário autenticado
    return <p>Signed in as {session.user.email}</p>;
  }

  // Usuário não autenticado
  return (
    <a href="/api/auth/signin">
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Sign in
      </button>
    </a>
  );
}

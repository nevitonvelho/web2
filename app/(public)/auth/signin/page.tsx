"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Faça Login</h1>
      <button
        onClick={() => signIn("credentials", { callbackUrl: "/" })}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Entrar com Credenciais
      </button>
    </div>
  );
}

"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      className="border px-6 rounded text-black border-black py-2"
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
    >
      Sair
    </button>
  );
}

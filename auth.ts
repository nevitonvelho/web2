import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import db from "@/lib/db";
import { compareSync } from "bcrypt-ts";

export const { handlers: { GET, POST }, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET, // Usando o segredo do .env

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user) return null;

        const matches = compareSync(password, user.password ?? "");
        if (!matches) return null;

        // Retorna os dados do usuário necessários para a sessão
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Adiciona informações do usuário ao token durante o login
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      // Adiciona o ID e a role ao objeto da sessão
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
});

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

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // No login, adiciona a role ao token
      if (user) {
        token.role = user.role;
      } else {
        // Busca a role no banco para garantir atualização
        const dbUser = await db.user.findUnique({
          where: { email: token.email }, // Garante que o token possui o email
          select: { role: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role; // Propaga o papel atualizado para a sessão
      }
      return session;
    },
  },
});

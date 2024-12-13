import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (user && credentials?.password === user.password) {
          return user; // Retorna o usuário
        }

        return null; // Caso contrário, falha na autenticação
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Adiciona o ID do usuário ao token
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id; // Propaga o ID do usuário para a sessão
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

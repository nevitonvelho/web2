// lib/db.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // para evitar recriar a conexão em dev
  var prisma: PrismaClient | undefined;
}

const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}

export default db;

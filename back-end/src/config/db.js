import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaNeon } from '@prisma/adapter-neon';
import { DATABASE_URL } from './env.js';

const adapter = new PrismaNeon({ connectionString: DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

export async function testConnection() {
  await prisma.$queryRaw`SELECT 1`;
  console.log('Koneksi database berhasil');
}
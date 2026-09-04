import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

// Required for Node.js, Cloudflare has native WebSocket
if (typeof WebSocket === 'undefined') {
  // @ts-ignore
  import('ws').then(ws => neonConfig.webSocketConstructor = ws.default);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL || "postgres://dummy:dummy@dummy.neon.tech/dummy";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

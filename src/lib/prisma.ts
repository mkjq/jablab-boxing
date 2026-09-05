import { neon, types } from '@neondatabase/serverless';
import { PrismaNeonHTTP } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

// Configure Neon to return dates/timestamps as strings for Prisma driver adapter
types.setTypeParser(1114, (str: string) => str); // TIMESTAMP
types.setTypeParser(1184, (str: string) => str); // TIMESTAMPTZ
types.setTypeParser(1082, (str: string) => str); // DATE
types.setTypeParser(1083, (str: string) => str); // TIME
types.setTypeParser(1266, (str: string) => str); // TIMETZ

const connectionString = process.env.DATABASE_URL || "postgres://dummy:dummy@dummy.neon.tech/dummy";

const sql = neon(connectionString);
// neon() v0.10+ requires sql.query for conventional function calls with placeholders
const client = (async (query: any, params: any, options: any) => {
  const result = await sql.query(query, params, options);
  if (result && Array.isArray(result.rows)) {
    for (let r = 0; r < result.rows.length; r++) {
      const row = result.rows[r];
      if (Array.isArray(row)) {
        for (let c = 0; c < row.length; c++) {
          if (row[c] instanceof Date) {
            row[c] = row[c].toISOString();
          }
        }
      }
    }
  }
  return result;
}) as any;
const adapter = new PrismaNeonHTTP(client);

const prismaClientSingleton = () => {
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export { prisma };

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const members = await prisma.member.findMany();
  console.log('Members count:', members.length);
  console.log(members);
}

main().catch(console.error).finally(() => prisma.$disconnect());

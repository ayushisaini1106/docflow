import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const docs = await prisma.document.findMany();
  for (const doc of docs) {
    console.log(`ID: ${doc.id}, Title: ${doc.title}, Length: ${doc.content ? doc.content.length : 0}`);
  }
  await prisma.$disconnect();
}

main().catch(console.error);

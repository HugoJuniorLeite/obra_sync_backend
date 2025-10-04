// import { PrismaClient } from '../generated/prisma/index.js';
// import { PrismaClient } from '../../generated/prisma/index.js';

import { PrismaClient } from "../src/generated/prisma";
const prisma = new PrismaClient();

async function main() {
await prisma.master.createMany({
  data: [
    {
      name: 'Decca Vieira',
      email: 'andreiavieira2353@gmail.com',
      cpf: '12345678901',
      token_access: null,
      code_expires_at: null,
      code_used: false,
    },
    {
      name: 'Hugo Junior',
      email: 'hjunioreng@gmail.com',
      cpf: '12345678902',
      token_access: null,
      code_expires_at: null,
      code_used: false,
    },
  ],
  skipDuplicates: true,
});

  console.log('Seed criada sem token/código.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

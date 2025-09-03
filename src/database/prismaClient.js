import pkg from '../generated/prisma/index.js'; // se estiver usando output customizado
const { PrismaClient } = pkg;

let prisma;
if (!global.prisma) {
  global.prisma = new PrismaClient();
}

prisma = global.prisma;
export default prisma;

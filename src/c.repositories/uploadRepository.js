import prisma from "../database/prismaClient.js";


export const uploadRepository = {
  async saveFile({ filename, url }) {
    return prisma.upload.create({
      data: {
        filename,
        url,
      },
    });
  },

  async listFiles() {
    return prisma.upload.findMany();
  },
};

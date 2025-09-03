// src/c.repositories/pdfRepository.js
import prisma from "../database/prismaClient.js";

export const pdfRepository = {
  async getFormData(rdoId) {
    return prisma.rdo.findUnique({
      where: { id: rdoId },
      include: { uploads: true },
    });
  }
};

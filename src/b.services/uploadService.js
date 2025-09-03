import { uploadRepository } from "../c.repositories/uploadRepository.js";

export const uploadService = {
  async handleUpload(file) {
    if (!file) throw new Error("Nenhum arquivo enviado");

    const saved = await uploadRepository.saveFile({
      filename: file.filename,
      url: `/uploads/${file.filename}`
    });

    return saved;
  },

  async getAll() {
    return uploadRepository.listFiles();
  }
};

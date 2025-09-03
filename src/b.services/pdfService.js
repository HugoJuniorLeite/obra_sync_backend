import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import {pdfRepository} from "../c.repositories/pdfRepository.js";

export const pdfService = {
  async generatePdf(rdoId) {
    const data = await pdfRepository.getFormData(rdoId);
    if (!data) throw new Error("RDO não encontrado");

    const outputPath = path.join("uploads", `RDO-${rdoId}.pdf`);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(outputPath));

    // Cabeçalho
    doc.fontSize(18).text(`Relatório RDO #${rdoId}`, { align: "center" });
    doc.moveDown();

    // Dados principais
    doc.fontSize(12).text(`Posição Ramal: ${data.posicaoRamal}`);
    doc.text(`Tipo Ramal: ${data.tipoRamal}`);
    doc.text(`Ramal Cortado: ${data.ramalCortado}`);
    doc.text(`Local Corte: ${data.localCorte}`);
    doc.text(`Comentário: ${data.comentario}`);
    doc.moveDown();

    // Fotos
    if (data.uploads.length > 0) {
      doc.text("Fotos anexadas:");
      data.uploads.forEach((file) => {
        const filePath = path.join("uploads", file.filename);
        if (fs.existsSync(filePath)) {
          doc.addPage().image(filePath, {
            fit: [500, 400],
            align: "center",
            valign: "center"
          });
        }
      });
    }

    doc.end();
    return { path: outputPath };
  }
};

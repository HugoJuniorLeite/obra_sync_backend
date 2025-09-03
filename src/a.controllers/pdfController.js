import { pdfService } from "../b.services/pdfService.js";

export const pdfController = {
  async generate(req, res) {
    try {
      const { id } = req.params;
      const result = await pdfService.generatePdf(parseInt(id));

      res.download(result.path, `RDO-${id}.pdf`);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

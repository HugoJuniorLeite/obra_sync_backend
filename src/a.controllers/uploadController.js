import { uploadService } from "../b.services/uploadService.js";

export const uploadController = {
  async upload(req, res) {
    try {
      const result = await uploadService.handleUpload(req.file);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async list(req, res) {
    try {
      const result = await uploadService.getAll();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

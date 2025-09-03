import express from "express";
import { pdfController } from "../a.controllers/pdfController.js";

const router = express.Router();

// Gera PDF a partir do RDO pelo ID
router.get("/:id", pdfController.generate);

export default router;

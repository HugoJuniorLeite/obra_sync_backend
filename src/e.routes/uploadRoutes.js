import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadController } from "../a.controllers/uploadController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Rotas
router.post("/", upload.single("file"), uploadController.upload);
router.get("/", uploadController.list);

export default router;

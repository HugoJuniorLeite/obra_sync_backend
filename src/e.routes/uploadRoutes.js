import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadController } from "../a.controllers/uploadController.js";
import supabase from "../supabaseClient.js"

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir);
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// // Rotas
// router.post("/", upload.single("file"), uploadController.upload);
// router.get("/", uploadController.list);

// export default router;



const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() }) // guarda os arquivos na memória

router.post("/upload", upload.fields([
  { name: "fotoCalcadaAntes" },
  { name: "fotoCroqui" },
  { name: "fotoFrenteImovel" },
  { name: "fotoPlacaRua" },
  { name: "fotoProtecaoMecanica" },
  { name: "fotoProvisorio" },
  { name: "fotoRamalCortado" },
  { name: "fotoRamalExposto" }
]), async (req, res) => {
  try {
    const files = req.files
    const fotosUrls = {}

    for (const key in files) {
      const file = files[key][0]
      const { data, error } = await supabase.storage
        .from("fotos") // nome do bucket que você criou
        .upload(`projeto/${Date.now()}_${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
        })
      if (error) throw error

      const { data: publicUrl } = supabase.storage
        .from("fotos")
        .getPublicUrl(data.path)

      fotosUrls[key] = publicUrl.publicUrl
    }

    res.json({ fotos: fotosUrls })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

export default router


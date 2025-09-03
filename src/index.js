import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import router from "./e.routes/index.js"
import path from "path"; 

// Importa as rotas novas
import uploadRoutes from "./e.routes/uploadRoutes.js";
import pdfRoutes from "./e.routes/pdfRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router)

// Servir arquivos estáticos da pasta uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Rotas novas
app.use("/api/upload", uploadRoutes);
app.use("/api/pdf", pdfRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});

export default app;
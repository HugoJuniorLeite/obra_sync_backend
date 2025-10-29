import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import router from "./e.routes/index.js"


const app = express();

app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: 'https://obra-sync-front.onrender.com', // seu frontend
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  credentials: true
}));
app.use(router)
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});

export default app;


// import express from "express";
// import cors from "cors";

// const app = express();

// app.use(express.json());

// // Configuração CORS correta para o Render
// app.use(cors({
//   origin:
//     "https://obra-sync-front.onrender.com", // Frontend no Render
//     // "http://localhost:5173",                // Permitir local para testes
//     //
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// // suas rotas
// app.post("/verify-access", (req, res) => {
//   // lógica...
// });

// // inicialização
// app.listen(4000, () => console.log("Server running on port 4000"));

// export default app;
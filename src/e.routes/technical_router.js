import { Router } from "express";
import technical_controller from "../a.controllers/technical_controller.js";

const technical_router = Router();

technical_router.post("/add-technical", technical_controller.create_technical);

export default technical_router;

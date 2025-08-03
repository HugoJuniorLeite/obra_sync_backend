import firm_controller from "../a.controllers/firm_controller.js";
import { Router } from "express";

const firm_router = Router();

firm_router.post("/add-firm", firm_controller.register_new_firm_controller);
firm_router.get("/all-firms", firm_controller.get_all_firms_controller);
firm_router.get("/firm-by-id/:id", firm_controller.get_firm_by_id_service);

export default firm_router;

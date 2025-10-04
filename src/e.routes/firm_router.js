import firm_controller from "../a.controllers/firm_controller.js";
import { Router } from "express";

const firm_router = Router();

firm_router.post("/add-firm", firm_controller.register_new_firm_controller);
firm_router.get("/all-firms", firm_controller.get_all_firms_controller);
firm_router.get("/firm-by-id/:id", firm_controller.get_firm_by_id_service);
firm_router.put("/alter-firm/:firm_id", firm_controller.update_firm_by_id);
firm_router.put("/deactivate-firm/:firm_id", firm_controller.deactivate_firm_controller);
export default firm_router;

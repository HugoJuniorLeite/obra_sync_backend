import occupation_controller from "../a.controllers/occupation_controller.js";
import {occupation_schema }from "../f.schemas/occupation_schema.js"
import { Router } from "express";
import { validateBody } from "../d.middlewares/validate_schema.js";

const occupation_router = Router();

occupation_router.post("/create-occupation", validateBody(occupation_schema), occupation_controller.create_occupation_controller);
occupation_router.get("/all-occupations", occupation_controller.get_all_occupations)
occupation_router.get("/occupation-by-id/:occupation_id", occupation_controller.get_occupation_by_id)
occupation_router.put("/update-occupation/:occupation_id", occupation_controller.update_occupation_by_id);
occupation_router.put("/delete-occupation/:occupation_id", occupation_controller.deactivate_occupation_controller);

export default occupation_router;
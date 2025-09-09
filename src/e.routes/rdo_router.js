import rdo_controller, { upload_photos_middleware } from "../a.controllers/rdo_controller.js"
import { Router } from "express";

const rdo_router = Router();

rdo_router.post("/create-rdo", upload_photos_middleware, rdo_controller.create_rdo_controller);
rdo_router.put("/not-executed/:bill_id", rdo_controller.rdo_not_executed);
rdo_router.get("/rdo-by-bill/:bill_id", rdo_controller.get_rdo_by_bill_id_controller)
rdo_router.get("/rdo-by-project/:project_id", rdo_controller.get_rdo_by_project_controller);

export default rdo_router;

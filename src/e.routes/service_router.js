import service_controller from "../a.controllers/service_controller.js";
import { Router } from "express";
import { validateBody } from "../d.middlewares/validate_schema.js";
import { service_schema } from "../f.schemas/service_schema.js";

const service_router = Router();

service_router.post("/add-service", validateBody(service_schema),service_controller.create_service_controller);
service_router.get("/service-by-id/:service_id", service_controller.get_service_by_id);
service_router.get("/service-by-project/:project_id", service_controller.get_all_services_by_project);
service_router.put("/alter-service/:service_id", service_controller.update_service);
service_router.put("/deactivate-service/:service_id", service_controller.deactivate_service_controller);

export default service_router;
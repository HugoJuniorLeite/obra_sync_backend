import project_controller from "../a.controllers/project_controller.js";
import { Router } from "express";
import { validateBody } from "../d.middlewares/validate_schema.js";
import { project_schema } from "../f.schemas/project_schema.js";
const project_router = Router();

project_router.post("/add-project", validateBody(project_schema),project_controller.create_project_controller);
project_router.get("/all-projects", project_controller.get_all_projects_controller);
project_router.get("/project-by-id/:project_id", project_controller.get_project_by_id_controller)
project_router.get("/projects-by-status/:status", project_controller.get_project_by_status_controller);
project_router.get("/project-by-firm/:firm_id", project_controller.get_project_by_firm_id_controller)
project_router.put("/alter-project/:project_id", project_controller.update_project_by_id)
project_router.put("/deactivate-project/:project_id", project_controller.deactivate_project_controller)

export default project_router
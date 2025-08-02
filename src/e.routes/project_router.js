import project_controller from "../a.controllers/project_controller.js";
import { Router } from "express";
import { validateBody } from "../d.middlewares/validate_schema.js";
import { project_schema } from "../f.schemas/project_schema.js";
const project_router = Router();

project_router.post("/add-project", validateBody(project_schema),project_controller.create_project_controller);
project_router.get("/all-projects", project_controller.get_all_projects_controller);
project_router.get("/project-by-id/:project_id", project_controller.get_project_by_id_controller)

export default project_router
import { Router } from "express";
import employee_controller from "../a.controllers/employee_controller.js";
import employee_schema from "../f.schemas/employee_schema.js"
import { validateBody } from "../d.middlewares/validate_schema.js";

const employee_router = Router();

employee_router.post("/add-employee",validateBody(employee_schema),employee_controller.register_employee_controller);
employee_router.get("/get-employee-by-project/:project_id", employee_controller.find_employee_by_project_controller);
employee_router.put("/alter-employee/:employee_id", employee_controller.update_employee_controller);
employee_router.put("/deactivate-employee/:employee_id", employee_controller.delete_employee);

export default employee_router;
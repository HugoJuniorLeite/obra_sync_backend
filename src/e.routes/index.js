import { Router } from "express";
import master_user from "./master_user_router.js";
import project_router from "./project_router.js";
import firm_router from "./firm_router.js";
import service_router from "./service_router.js"
import occupation_router from "./occupation_router.js";
import employee_router from "./employee_router.js";

const router = Router();

router.use(master_user);
router.use(project_router);
router.use(firm_router);
router.use(service_router);
router.use(occupation_router);
router.use(employee_router);
export default router;
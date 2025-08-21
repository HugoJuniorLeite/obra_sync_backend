import { Router } from "express";
import master_user from "./master_user_router.js";
import project_router from "./project_router.js";
import firm_router from "./firm_router.js";
import service_router from "./service_router.js"
import occupation_router from "./occupation_router.js";
import employee_router from "./employee_router.js";
import bill_router from "./bill_router.js";
import auth_router from "./auth_router.js";

const router = Router();

router.use(master_user);
router.use(project_router);
router.use(firm_router);
router.use(service_router);
router.use(occupation_router);
router.use(employee_router);
router.use(bill_router);
router.use(auth_router);

export default router;
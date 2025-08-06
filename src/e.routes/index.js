import { Router } from "express";
import master_user from "./master_user_router.js";
import project_router from "./project_router.js";
import firm_router from "./firm_router.js";
import service_router from "./service_router.js"

const router = Router();

router.use(master_user);
router.use(project_router);
router.use(firm_router);
router.use(service_router);
export default router;
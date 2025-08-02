import { Router } from "express";
import master_user from "./master_user_router.js";
import project_router from "./project_router.js";

const router = Router();

router.use(master_user);
router.use(project_router);

export default router;
import { Router } from "express";
import master_user from "./master_user_router.js";

const router = Router();

router.use(master_user);


export default router;
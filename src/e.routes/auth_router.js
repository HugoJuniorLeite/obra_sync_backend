import { Router } from "express";
import auth_controller from "../a.controllers/auth_controller.js";

const auth_router = Router();

auth_router.post("/verify-access",auth_controller.is_first_access_controller);

export default auth_router;
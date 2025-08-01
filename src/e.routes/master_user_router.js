import { Router } from "express";
import master_user_controller from "../a.controllers/master_user_controller.js";
import { validateBody } from "../d.middlewares/validate_schema.js";
import { master_user_schema, master_token_schema } from "../f.schemas/master_user_schema.js";

const master_user = Router();

master_user.put("/super-access", validateBody(master_user_schema),master_user_controller.validate_master_user);
master_user.post("/verify-token", validateBody(master_token_schema), master_user_controller.validate_token_controller);
export default master_user;
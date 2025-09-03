import rdo_controller, { upload_photos_middleware } from "../a.controllers/rdo_controller.js"
import { Router } from "express";

const rdo_router = Router();

rdo_router.post("/create-rdo", upload_photos_middleware, rdo_controller.create_rdo_controller);

export default rdo_router;

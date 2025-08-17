import { Router } from "express";
import bill_controller from "../a.controllers/bill_controller.js";

const bill_router = Router();

bill_router.post("/add-bill", bill_controller.create_bill_controller);
bill_router.put("/dispatch-bill/:bill_id", bill_controller.dispatch_bill_controller);
bill_router.get("/get-bills", bill_controller.get_bill_filtered_controller);
export default bill_router;
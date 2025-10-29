// import api from "./api";


async function postRdo(payload) {
  const response = await api.post('/create-rdo', payload);
  return response.data;
}

async function getOccupation() {
  const response = await api.get('/all-occupations');
  return response.data;
}

async function getOccupationById(payload) {
  const response = await api.get(`/occupation-by-id/${payload}`);
  return response.data;
}



async function getPdf(id) {
  console.log(id)
  const response = await api.get(`/rdo-by-bill/${id}/pdf`, {
    responseType: 'blob' // <-- importante
  });
  return response.data; // aqui já é Blob
}




const createRdo = { postRdo, getOccupation, getOccupationById, getPdf }

export default createRdo;

// import rdo_controller, { upload_photos_middleware } from "../a.controllers/rdo_controller.js"
// import { Router } from "express";

// const rdo_router = Router();

// rdo_router.post("/create-rdo", upload_photos_middleware, rdo_controller.create_rdo_controller);
// rdo_router.put("/not-executed/:bill_id", rdo_controller.rdo_not_executed);
// rdo_router.get("/rdo-by-bill/:bill_id", rdo_controller.get_rdo_by_bill_id_controller)
// rdo_router.get("/rdo-by-project/:project_id", rdo_controller.get_rdo_by_project_controller);

// export default rdo_router;

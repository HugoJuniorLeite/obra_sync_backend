import technical_service from "../b.services/technical_service.js";

async function create_technical(req, res) {
    const data = req.body;
if(!data || data === undefined){
    throw new Error("Obrigatório inserir dados válidos");
 }
    try {
    await technical_service.create_technical_service(data)
    res.status(201).send("Técnico cadastrado com sucesso!")
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
};

const technical_controller = {
    create_technical
}
export default technical_controller;
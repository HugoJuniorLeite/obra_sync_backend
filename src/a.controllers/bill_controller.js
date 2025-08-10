import bill_service from "../b.services/bill_service.js";

async function create_bill_controller(req,res) {
    const data = req.body;
    if (!data || data === undefined) {
        throw new Error("Obrigatório informar dados válidos");
            }
    try {
        await bill_service.create_bill_service(data);
        res.status(201).send("Cadastro realizado com sucesso!")
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
}

async function dispatch_bill_controller(req, res) {
    const data = req.body;
    const bill_id = req.params.bill_id;
    try {
        await bill_service.dispatch_bill_service( data, bill_id);
        res.status(201).send("Nota despachada com sucesso!")
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
}
const bill_controller = {
    create_bill_controller, dispatch_bill_controller
}

export default bill_controller;
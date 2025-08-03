import firm_service from "../b.services/firm_service.js";

async function register_new_firm_controller(req, res) {
    const firm = req.body;
    try {
        const result = await firm_service.register_new_firm_service(firm)
    res.status(201).send(result)
    } catch (error) {
     return res.status(error.status || 400).json({message: error.message});     
    }
}

async function get_all_firms_controller(req,res ) {
    try {
        const result = await firm_service.get_firms()
    res.status(201).send(result)
    } catch (error) {
     return res.status(error.status || 400).json({message: error.message});     
    } 
}

async function get_firm_by_id_service(req,res) {
    const id = req.params.id
     try {
        const result = await firm_service.firm_by_id(id)
    res.status(201).send(result)
    } catch (error) {
     return res.status(error.status || 400).json({message: error.message});     
    }
}

const firm_controller = {
    register_new_firm_controller, get_all_firms_controller, get_firm_by_id_service
}

export default firm_controller;
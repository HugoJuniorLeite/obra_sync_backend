import occupation_service from "../b.services/occupation_service.js";

async function create_occupation_controller(req, res) {
    const data = req.body;
    console.log(data);
    
    try {
       if (!data || data === undefined || data === null) {
        return res.status(error.status || 400).json({message:"Campos inválidos"});
       }
       await occupation_service.create_occupation_service(data);
       res.status(201).send("Cadastro realizado com sucesso") 
    } catch (error) {
            return res.status(error.status || 404).json({message: error.message});
    }
}

async function get_all_occupations(req, res) {
    
    try {
        const all_occupations = await occupation_service.get_all_occupations_service();
        if (!all_occupations || all_occupations.length === 0) {
            res.status(200).send("Nenhum cargo cadastrado")
        }
        res.status(200).send(all_occupations);
    } catch (error) {
        return res.status(error.status || 404).json({message: error.message});
    }
}

async function get_occupation_by_id(req, res) {
    const occupation_id = req.params.occupation_id
    try {
        const occupation_by_id = await occupation_service.get_occupation_by_id_service(occupation_id);
        if (!occupation_by_id || occupation_by_id === null) {
            res.status(200).send("Cargo selecionado não encontrado")
        }
        res.status(200).send(occupation_by_id);
    } catch (error) {
        return res.status(error.status || 404).json({message: error.message});
    }
}

async function update_occupation_by_id(req, res) {
    const data = req.body
    const occupation_id = req.params.occupation_id;

console.log(occupation_id, "project_id", req.body, "data", data);

    try {
        await occupation_service.update_occupation(data, occupation_id)
        res.status(200).send("Dados alterados com sucesso")
    } catch (error) {
       return res.status(error.status || 400).json({message: error.message});      
    }
}

async function deactivate_occupation_controller(req, res) {
    const occupation_id = req.params.occupation_id;
      try {
        await occupation_service.deactivate_occupation_service(occupation_id)
        res.status(200).send("Cadastro excluído com sucesso")
    } catch (error) {
       return res.status(error.status || 400).json({message: error.message});      
    }
}


const occupation_controller = { 
    create_occupation_controller, get_occupation_by_id, get_all_occupations, deactivate_occupation_controller,update_occupation_by_id,
}

export default occupation_controller;
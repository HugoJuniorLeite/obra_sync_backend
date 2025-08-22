import service_service from "../b.services/service_service.js";

async function create_service_controller(req, res) {
    const data = req.body;

    
    try {
        if(!data){
           return res.status(400).send("É necessário enviar todos os campos")
        }
       const created_service = await service_service.create_service_service(data);
        res.status(201).json({message: "Serviço cadastrado com sucesso!",created_service});
    } catch (error) {
       return res.status(error.status || 400).json({message: error.message});       
    }
}

async function get_all_services_by_project(req, res) {
    const project_id = req.params.project_id;
    try {
        if (!project_id || project_id === undefined) {
            res.status(400).send("É obrigatório informar um projeto válido")
        }
        const services_by_project = await service_service.all_service_by_project(project_id);
        if (services_by_project.length === 0) {
            res.status(200).send("Não há serviços cadastrados nesse projeto");
        }
        res.status(200).send(services_by_project);
    } catch (error) {
       return res.status(error.status || 400).json({message: error.message});       
    }
}

async function get_service_by_id(req, res) {
    const service_id = req.params.service_id;
    
    try {
        if (!service_id || service_id === undefined) {
            res.status(400).send("É obrigatório informar um serviço válido")
        }
        const selected_service = await service_service.get_service_by_id(service_id);
        if(!selected_service || selected_service === null ){
            res.status(400).send("Serviço não encontrado")
        }
        res.status(200).send(selected_service);
    } catch (error) {
       return res.status(error.status || 400).json({message: error.message});       
    }
}
async function update_service(req, res) {
    const data = req.body;
    const service_id = req.params.service_id;
    try {
        if (!data || ! service_id || data === undefined || service_id === undefined) {
           res.status(400).send("É obrigatório informar todos os campos necessários") 
        }
await service_service.update_service(service_id, data);
res.status(200).send("Dados atualizados com sucesso")

    } catch (error) {
       return res.status(error.status || 400).json({message: error.message});       
    }
}

async function deactivate_service_controller(req, res) {
      const service_id = req.params.service_id;
    try {
         if (! service_id || service_id === undefined) {
           res.status(400).send("É obrigatório informar um serviço válido") 
        }
        await service_service.deactivate_service(service_id);
        res.status(200).send("Serviço excluído com sucesso")
    } catch (error) {
       return res.status(error.status || 400).json({message: error.message});       
    }
}

async function get_service_by_occupation_controller(req, res) {
    const {employee_id} = req.params;
console.log(employee_id);

    try {
        const services_by_occupation = await service_service.get_service_by_occupation_service(employee_id);

    return res.status(200).send(services_by_occupation);
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message});  
    }
    
}

const service_controller = {
   get_service_by_occupation_controller ,create_service_controller, get_all_services_by_project, get_service_by_id, update_service, deactivate_service_controller
}

export default service_controller;
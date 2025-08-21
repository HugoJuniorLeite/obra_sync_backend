import project_repository from "../c.repositories/project_repository.js";
import service_repository from "../c.repositories/service_repository.js";

async function create_service_service(data) {
    try {console.log(data, "service");
    
        if (!data) {
            throw new Error("Dados obrigatórios");
          }
        const service_exists = await service_repository.get_service_by_name(data.name, data.project_id)
    const project_exists = await project_repository.get_project_by_id(data.project_id);
      console.log(project_exists, "projectExists");
       
    if(!project_exists){
        throw new Error("Projeto não existe");
    }
    if (service_exists) {
        throw new Error("Serviço já cadastrado");
        }
    await service_repository.create_service(data);
    return
    } catch (error) {
        throw new Error(error.message);
        
    }
}


async function get_service_by_id(service_id) {
    try {
        if (!service_id || service_id === null || service_id === undefined) {
           throw new Error("Obrigatório informar um id válido");
         }
        const selected_service = await service_repository.get_service_by_id(service_id)
    if(!selected_service || selected_service === null || selected_service === undefined){
        throw new Error("Serviço selecionado não foi encontrado");
            }
        return selected_service;
    
    
    } catch (error) {
        throw new Error(error.message);
        
    }
}


async function all_service_by_project(project_id) {
        try {
    if(!project_id || project_id === null){
        "Projeto selecionado inválido"
    }    
    const selected_project = await project_repository.get_project_by_id(project_id);
if (selected_project === null || selected_project === undefined) {
    throw new Error("Projeto selecionado não existe");
    }
    const service_by_project = await service_repository.get_all_services(project_id);
    if (!service_by_project || service_by_project.length === 0) {
        throw new Error("Não há serviços cadastrados nesse projeto");
        }

        return service_by_project;

    } catch (error) {
        throw new Error(error.message);
        
    }
}


async function update_service(service_id, data) {
    try {
        if(!service_id || !data){
            throw new Error("Dados incompletos");
        }
        const service_exists = await service_repository.get_service_by_id(service_id);
        if (!service_exists || service_exists === null) {
            throw new Error("Serviço não encontrado");
        }
        await service_repository.update_service_id(service_id, data);

        return
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function deactivate_service(service_id) {
    try {
       if (!service_id || service_id === undefined) {
        throw new Error("Obrigatório informar um serviço válido");
       }
       const service_exists = await service_repository.get_service_by_id(service_id);
        if (!service_exists || service_exists === null) {
            throw new Error("Serviço não encontrado");
        }
        await service_repository.deactivate_service(service_id);
        return
    } catch (error) {
        throw new Error(error.message);
        
    }
}

const service_service = {
    create_service_service, get_service_by_id, all_service_by_project, update_service, deactivate_service
}

export default service_service;
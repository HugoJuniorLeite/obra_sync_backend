import project_repository from "../c.repositories/project_repository.js";
import firm_repository from "../c.repositories/firm_repository.js"


async function create_project_service(data) {
    
    try {
        if (!data || data === null) {
            throw new Error("Campos obrigatórios");
          }
    const firm_exists = await firm_repository.get_firm_by_id(data.firm_id)
       const contract_exists = await project_repository.verify_project_exists(data.number_contract)
    const name_contracts_exists = await project_repository.name_project_exists(data.name) 
   
    if (!firm_exists) {
        throw new Error("Empresa não cadastrada");
        
    }
    if (contract_exists || name_contracts_exists) {
        throw new Error("Conflito. Contrato já cadastrado");
            }
await project_repository.create_project(data)
return
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function get_all_projects_service() {
    try {
      const all_projects = await project_repository.get_all_projects();
return all_projects
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function get_project_by_id_service (project_id){

    try {
        const project_selected = await project_repository.get_project_by_id(project_id) 
   if (!project_selected || project_selected === null) {
    throw new Error("Projeto não encontrado!");
    
}
    return project_selected;
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function get_project_by_status(status) {
    
    try {
        const filtered_projects = await project_repository.get_project_by_status(status)
   return filtered_projects
    } catch (error) {
        throw new Error(error.message);
    }
}

async function get_project_by_firm_id_service(firm_id) {
    try {
        const firm_exists = await firm_repository.get_firm_by_id(firm_id);
         if (!firm_exists) {
        throw new Error("Empresa não cadastrada");
        
    }
      const project_by_firm = await project_repository.get_project_by_firm_id(firm_id)  
    if (project_by_firm.length === 0) {
        throw new Error("Não há projetos cadastrados para essa empresa");
        
    }
    
      return project_by_firm
    } catch (error) {
        throw new Error(error.message);
        
    }
}
const project_service = {
    create_project_service, get_all_projects_service,get_project_by_id_service, get_project_by_status, get_project_by_firm_id_service
}

export default project_service
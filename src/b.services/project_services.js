import project_repository from "../c.repositories/project_repository.js";

async function create_project_service(data) {
    
    try {
        if (!data || data === null) {
            throw new Error("Campos obrigatórios");
          }
       const contract_exists = await project_repository.verify_project_exists(data.number_contract)
    const name_contracts_exists = await project_repository.name_project_exists(data.name) 
    console.log(contract_exists, "contracts");
    
    if (contract_exists || name_contracts_exists) {
        throw new Error("Conflito. Contrato já cadastrado");
            }
await project_repository.create_project(data)

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
const project_service = {
    create_project_service, get_all_projects_service,get_project_by_id_service
}

export default project_service
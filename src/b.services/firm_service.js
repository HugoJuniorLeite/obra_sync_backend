import firm_repository from "../c.repositories/firm_repository.js";
import project_repository from "../c.repositories/project_repository.js";


async function register_new_firm_service(firm) {
    
    try {
        await firm_repository.register_firm(firm)
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function get_firms() {
    
    try {
        const all_firms = await firm_repository.get_firms();
        return all_firms;
    } catch (error) {
        
    }
}

async function firm_by_id(id) {
    try {
        const selected_firm = await firm_repository.get_firm_by_id(id);
       if (selected_firm === null || !selected_firm) {
        throw new Error("Empresa não encontrada");
        
       }
        return selected_firm;
    } catch (error) {
        throw new Error(error.message);
        
    }}

async function update_firm(data, firm_id) {
    console.log(firm_id, data, "service");
    
      try {
        const selected_firm = await firm_repository.get_firm_by_id(firm_id);
       console.log(selected_firm, "service");
       
        if (selected_firm === null || !selected_firm) {
        throw new Error("Empresa não encontrada");
      }
      await firm_repository.update_firm_id(firm_id, data);
        return 
    } catch (error) {
        throw new Error(error.message);
        
    }}

    async function deactivate_firm_service(firm_id) {
        if (!firm_id || firm_id === undefined) {
            throw new Error("Obrigatório inserir um Id válido");
                    }
        try {

        const selected_firm = await firm_repository.get_firm_by_id(firm_id);
       
        if (selected_firm === null || !selected_firm) {
        throw new Error("Empresa não encontrada");
      }
const exists_projects_by_firm = await project_repository.get_project_by_firm_id(firm_id);

if (exists_projects_by_firm.length !== 0 ) {
    throw new Error("Existem projetos cadastrados que pertencem a essa empresa");
    
}
            await firm_repository.deactivate_firm(firm_id);
            return
        } catch (error) {
            throw new Error(error.message);
            
        }
    }


const firm_service = {
    register_new_firm_service, get_firms, firm_by_id, update_firm, deactivate_firm_service
}

export default firm_service;
import occupation_repository from "../c.repositories/occupation_repository.js";

async function create_occupation_service(data) {
    try {
        if (!data || data === undefined) {
            throw new Error("Dados enviados inválidos");
            }
    const occupation_exists = await occupation_repository.verify_occupation_exists(data.name)
if (occupation_exists) {
    throw new Error("Ocupação já cadastrada");
}    
await occupation_repository.create_occupation(data);
return
} catch (error) {
        throw new Error(error.message);
      }
}

async function get_all_occupations_service() {
    try {
        const all_occupations = await occupation_repository.get_all_occupations();
        if (!all_occupations || all_occupations.length === 0) {
            throw new Error("Nenhum cargo cadastrado");
         }
         console.log(all_occupations);
         
         return all_occupations;

    } catch (error) {
        throw new Error(error.message);
      }
}

async function get_occupation_by_id_service(occupation_id) {
    try {
        const occupation_by_id = await occupation_repository.get_occupation_by_id(occupation_id);
        if (!occupation_by_id || occupation_by_id === null) {
            throw new Error("Nenhum cargo com esse Id");
         }
         console.log(occupation_by_id);
         
         return occupation_by_id;

    } catch (error) {
        throw new Error(error.message);
      }
}

async function update_occupation(data, occupation_id) {
    console.log(occupation_id, data, "service");
    
      try {
        const selected_occuṕation = await occupation_repository.get_occupation_by_id(occupation_id);
       console.log(selected_occuṕation, "service");
       
        if (selected_occuṕation === null || !selected_occuṕation) {
        throw new Error("Cargo não encontrado");
      }
       const occupation_exists = await occupation_repository.verify_occupation_exists(data.name)
if (occupation_exists) {
    throw new Error("Ocupação já cadastrada");
}    
      await occupation_repository.update_occupation_id(occupation_id, data);
        return 
    } catch (error) {
        throw new Error(error.message);
        
    }}

    async function deactivate_occupation_service(occupation_id) {
        if (!occupation_id || occupation_id === undefined) {
            throw new Error("Obrigatório inserir um Id válido");
                    }
        try {

        const selected_occuṕation = await occupation_repository.get_occupation_by_id(occupation_id);
       console.log(selected_occuṕation, "selected_project");
       
        if (selected_occuṕation === null || !selected_occuṕation) {
        throw new Error("Cargo encontrado");
      }

            await occupation_repository.deactivate_occupation(occupation_id);
            return
        } catch (error) {
            throw new Error(error.message);
            
        }
    }


const occupation_service = {
    create_occupation_service, get_occupation_by_id_service,get_all_occupations_service, update_occupation,deactivate_occupation_service
}

export default occupation_service;
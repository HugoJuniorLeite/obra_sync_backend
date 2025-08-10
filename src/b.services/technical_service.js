import technical_repository from "../c.repositories/technical_repository.js";
import employee_repository from "../c.repositories/employee_repository.js";

async function create_technical_service(data) {
    if (!data || data === undefined) {
        throw new Error("Dados inválidos");
        }
    try {
        const employee_exists = await employee_repository.find_employee_by_id(data.employee_id);
        if (!employee_exists || employee_exists === null) {
            throw new Error("Funcionário não encontrado!");
          };
        const project = await employee_repository.employee_project(employee_exists.id);
if (!project || project === null) {
    throw new Error("Projecto não encontrado");
    }
    await technical_repository.create_technical(project.id, data);
    return
    } catch (error) {
        throw new Error(error.message);
        
    }
}




const technical_service = {
    create_technical_service, 
}

export default technical_service;
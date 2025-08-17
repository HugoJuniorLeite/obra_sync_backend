import auth_repository from "../c.repositories/auth_repository.js";
import employee_repository from "../c.repositories/employee_repository.js";

async function is_first_access_service(data) {
    if (!data || data === undefined){
        throw new Error("Dados Inválidos!");
        }
    try {
        const employee_id = await employee_repository.find_employee(data);
        if (!employee_id || employee_id === null) {
            throw new Error("Cpf não cadastrado!");
        }
        const first_access_employee = await auth_repository.is_first_access(employee_id.id);
        return first_access_employee;
        } catch (error) {
        throw new Error(error.message);
        
    }
}

const auth_service = {
    is_first_access_service,
}

export default auth_service;
import employee_repository from "../c.repositories/employee_repository.js";
import bcrypt from "bcrypt";
import project_repository from "../c.repositories/project_repository.js"


async function register_employee(data) {
    try {
    const employee_exists = await employee_repository.find_employee(data.cpf);
    if (employee_exists){
throw new Error ("Usuário já cadastrado!")
    }
    const registration_token = data.cpf.slice(0, 6);
     const pass = registration_token;
      const saltRounds = 10; 
      const hash = await bcrypt.hash(pass, saltRounds);
  data.registration_token = hash;
  console.log(data.registration_token, "token");
  
  if (data.cnhs !== undefined) {
    
const new_employee = await employee_repository.create_employee(data)

    await employee_repository.create_cnh(new_employee.id, data.cnhs)
}else{
   const new_employee = await employee_repository.create_employee(data)
}
    return 

    } catch (error) {
        throw error
    }
}

async function find_employee_by_project_service(project_id) {
    try {
        const project_exists = await project_repository.get_project_by_id(project_id)
if (!project_exists || project_exists === null) {
    throw new Error("Projeto não existe");
    }
    const employee_by_project = await employee_repository.find_employee_by_project(project_id);
return employee_by_project;    
} catch (error) {
        throw new Error(error.message);
        
    }
}

async function update_employee(employee_id, data) {
    
    try {
        if (!employee_id || !data || employee_id === undefined || data === undefined) {
            throw new Error("É obrigatório informar os dados corretos");
        }
        console.log(data, "services");
        
        const employee_exists = await employee_repository.find_employee_by_id(employee_id);
    if (!employee_exists){
throw new Error ("Funcionário não encontrado")
    }
    await employee_repository.updateEmployeeWithRelations(employee_id, data)
    return
    } catch (error) {
        throw new Error(error.message);
    }
}

async function delete_employee(employee_id) {
    try {
        if (!employee_id || employee_id === undefined) {
           throw new Error("É obrigatório informar os dados corretos");  
        }
const employee_exists = await employee_repository.find_employee_by_id(employee_id);
    if (!employee_exists){
throw new Error ("Funcionário não encontrado")
    }
    await employee_repository.deactivate_employee(employee_id);
    return
    } catch (error) {
        throw new Error(error.message);
    }
}

const employee_service = {
    register_employee, find_employee_by_project_service, delete_employee,update_employee
}

export default employee_service;
import auth_repository from "../c.repositories/auth_repository.js";
import employee_repository from "../c.repositories/employee_repository.js";
import bcrypt from "bcrypt";

async function is_first_access_service(cpf) {
    if (!cpf) {
        throw new Error("Dados inválidos!");
    }

    try {
        const employee = await employee_repository.find_employee(cpf);

        if (!employee) {
           throw new Error("CPF não cadastrado!");
        }

        const first_access_employee = await auth_repository.is_first_access(employee.id);

        return first_access_employee; 
    } catch (error) {
        throw new Error(error.message);
    }
}

async function change_password_service(cpf, old_password, new_password) {
   if (!cpf, old_password, new_password) {
    throw new Error("Dados inválidos!");
};
try {
 const employee = await employee_repository.find_employee(cpf);
        if (!employee) {
           throw new Error("CPF não cadastrado!");
        };
if (employee.first_access === true) {
    await auth_repository.update_first_access(employee.id);
}
    const password_ok = await bcrypt.compare(old_password, employee.password_hash);

if (password_ok) {
 await auth_repository.change_password_repository(employee.cpf, new_password)
 return
} else {
throw new Error("Usuário ou senha incorretos");
};

} catch (error) {
    throw new Error(error.message);
} 
}

const auth_service = {
    is_first_access_service, change_password_service
};

export default auth_service;

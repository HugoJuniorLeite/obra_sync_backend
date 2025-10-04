import auth_repository from "../c.repositories/auth_repository.js";
import employee_repository from "../c.repositories/employee_repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

async function compare_password(cpf, password) {
    try {

        if (!cpf || !password) {
            throw new Error("Dados inválidos!");
        }
        
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) throw new Error("JWT_SECRET não definido!");
        
        const employee = await employee_repository.find_employee(cpf);
        if (!employee) {
            throw new Error("CPF não cadastrado!");
        }
        
        const password_ok = await bcrypt.compare(password, employee.password_hash);
        if (!password_ok) {
            throw new Error("Usuário ou senha inválidos!");
        }
        
        const token = jwt.sign(
            { userId: employee.id, occupation: employee.occupation_id },
            JWT_SECRET,
            { expiresIn: "24h" }
        );
        
        return token
    
    } catch (error) {
         throw new Error(error.message);
    }
}

async function change_password_service(cpf, old_password, new_password) {
   if (!cpf, !old_password, !new_password) {
    throw new Error("Dados inválidos!");
};

try {
    //vê se o funcionário existe
 const employee = await employee_repository.find_employee(cpf);
        if (!employee) {
           throw new Error("CPF não cadastrado!");
        };
        //Se existir, atualiza o first_access para True
console.log(employee.first_access, "first access");


//Compara se a senha antiga digitada é igual a senha que está no banco

const password_ok = await bcrypt.compare(old_password, employee.password_hash);

//Se for true, adiciona o cpf e a nova senha para atualizar no banco de dados

if (password_ok) {
         if (employee.first_access === false) {
             await auth_repository.update_first_access(employee.id)}
        const pass = new_password;
          const saltRounds = 11; 
          const hash = await bcrypt.hash(pass, saltRounds);
 await auth_repository.change_password_repository(employee.id, hash)
 return
} else {
throw new Error("Usuário ou senha incorretos");
};

} catch (error) {
    throw new Error(error.message);
} 
}

const auth_service = {
    is_first_access_service, change_password_service, compare_password
};

export default auth_service;

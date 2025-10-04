import prisma from "../database/prismaClient.js";

async function is_first_access(id) {
    try {
        return prisma.employee.findFirst({
            where: {id: Number(id) }
        })
    } catch (error) {
        throw new Error(error.message);
       }
}

async function compare_password(id, old_password) {
    if (!old_password) {
        throw new Error("Dados iválidos");
        }
    try {
       return prisma.employee.findFirst({
        where: {
            id: Number(id)
        }
       }) 
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function update_first_access(id) {
    try {
       return prisma.employee.update({
        where: {id: Number(id)},
        data:{ first_access: true}
       }) 
    } catch (error) {
       throw new Error(error.message); 
    }
}

async function change_password_repository(id, new_password) {

    try {
        return prisma.employee.update({
where : {id: Number(id)},
data: {password_hash: new_password},
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

const auth_repository = {
    is_first_access, compare_password, change_password_repository, update_first_access
}
export default auth_repository;
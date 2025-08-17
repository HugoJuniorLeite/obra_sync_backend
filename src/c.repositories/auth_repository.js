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

const auth_repository = {
    is_first_access, 
}

export default auth_repository;
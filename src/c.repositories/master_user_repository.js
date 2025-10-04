import prisma from "../database/prismaClient.js";

async function verify_master_exists(email) {
   
    
    return prisma.master.findFirst({
        where: {email}
    })
}

async function master_access_token(email, token) {
 
    return prisma.master.update({
    where: {email},
        data:
        {token_access: token}
    })
}

async function validate_token(email) {
    return prisma.master.findFirst({
        where: {email}
    })
}

const master_user_repository = {
    verify_master_exists, master_access_token, validate_token
}

export default master_user_repository
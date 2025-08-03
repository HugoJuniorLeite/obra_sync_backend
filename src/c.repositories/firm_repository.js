import prisma from "../database/prismaClient.js";

//Cadastra uma nova empresa cliente
async function register_firm(data_company) {
    return prisma.firm.create({
        data:{
            name: data_company.name,
            email: data_company.email,
            cnpj: data_company.cnpj
        }
    })
}

//Retorna todas as empresas cadastradas
async function get_firms() {
    return prisma.firm.findMany({

    })
}

//Retorna a empresa pelo id
async function get_firm_by_id(id) {
    return prisma.firm.findFirst({
        where:{id:Number(id)} 
    })
}

const firm_repository = {
    register_firm, get_firms, get_firm_by_id
}

export default firm_repository;
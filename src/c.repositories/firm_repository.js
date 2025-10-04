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
where:{ active: true}
    })
}

//Retorna a empresa pelo id
async function get_firm_by_id(id) {
   
    return prisma.firm.findFirst({
        where:{id:Number(id), active: true} 
    })
}

//Altera campos da empresa cadastrada
async function update_firm_id(firm_id, data) {
    
   const update_data = {};
  if (data.name !== undefined) update_data.name = data.name;
  if (data.email !== undefined) update_data.email = data.email;
  if (data.cnpj !== undefined) update_data.cnpj = data.cnpj;

  if (Object.keys(update_data).length === 0) {
    throw new Error('Nenhum campo para atualizar foi fornecido.');
  }

  try {
    const updated = await prisma.firm.update({
      where: { id: Number(firm_id) },
      data: update_data,
    });
    return updated;
  } catch (error) {

    throw new Error(error.message);
  }
}

async function deactivate_firm(firm_id) {
    return prisma.firm.update({
        where: {id: Number(firm_id)},
        data: {active: false}
    })
}

const firm_repository = {
    register_firm, get_firms, get_firm_by_id, update_firm_id, deactivate_firm
}

export default firm_repository;
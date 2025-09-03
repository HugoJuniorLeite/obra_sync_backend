import prisma from "../database/prismaClient.js";


//Valida se o id do contrato já está cadastrado.
async function verify_project_exists(number_contract) {
    
    try {
        return prisma.project.findFirst({
            where: {number_contract,  active: true}
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}
//Valida se já existe um projeto com o mesmo nome cadastrado
async function name_project_exists(project_name) {
    try {
        return prisma.project.findFirst({
            where:{name: project_name,  active: true}
        })
        
    } catch (error) {
        throw new Error(error.message);
    }
}
//Cadastra um novo projeto
async function create_project(data) {
  
    
    try {
        return prisma.project.create({
            data: {
      name: data.name,
      number_contract: data.number_contract ,
      description: data.description,
      estimated_price: data.estimated_price,
      start_date : data.start_date,
      estimated_end_date: data.estimated_end_date,
      responsible_contract: data.responsible_contract,
      firm_id:Number(data.firm_id)
            }
        })
        
    } catch (error) {
        throw new Error(error.message);
        
    }
}

//Retorna todos os projetos cadastrados
async function get_all_projects() {
    try {
       return prisma.project.findMany({
        where: {active: true}
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

//Retorna o projeto pelo id
async function get_project_by_id(project_id) {
    try {
        return prisma.project.findFirst({
            where:{id: Number(project_id), active: true}
        })
    } catch (error) {
        throw new Error("groot chatooooo");
        
    }
}

//Retorna o projeto pelo status
async function get_project_by_status(status){
    try {
        return prisma.project.findMany({
            where: {status : status,  active: true},
            orderBy: {estimated_price: 'desc'}
        })
    } catch (error) {
       throw new Error(error.message); 
    }
}

async function get_project_by_firm_id(firm_id) {
    try {
       return prisma.project.findMany({
        where:{
            firm_id: Number(firm_id), active: true
        }
       }) 
    } catch (error) {
        throw new Error(error.message);
        
    }
}


async function update_project_id(project_id, data) {
    
   const update_data = {};
  if (data.name !== undefined) update_data.name = data.name;
  if (data.number_contract !== undefined) update_data.number_contract = data.number_contract;
  if (data.description !== undefined) update_data.description = data.description;
  if (data.estimated_price !== undefined) update_data.estimated_price = data.estimated_price;
  if (data.start_date !== undefined) update_data.start_date = data.start_date;
  if (data.estimated_end_date !== undefined) update_data.estimated_end_date = data.estimated_end_date;
  if (data.status !== undefined) update_data.status = data.status;
  if (data.responsible_contract !== undefined) update_data.responsible_contract = data.responsible_contract;
  if (data.firm_id !== undefined) update_data.firm_id = data.firm_id;
 
 
  if (Object.keys(update_data).length === 0) {
    throw new Error('Nenhum campo para atualizar foi fornecido.');
  }

  try {
    const updated = await prisma.project.update({
      where: { id: Number(project_id) },
      data: update_data,
    });
    return updated;
  } catch (error) {

    throw new Error(error.message);
  }
}

async function deactivate_project(project_id) {
    return prisma.project.update({
        where: {id: Number(project_id)},
        data: {active: false}
    })
}






const project_repository = {
    verify_project_exists, create_project, name_project_exists, get_all_projects, get_project_by_id, get_project_by_status, get_project_by_firm_id, update_project_id, deactivate_project}

export default project_repository;
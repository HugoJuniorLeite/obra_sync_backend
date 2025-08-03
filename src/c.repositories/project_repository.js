import prisma from "../database/prismaClient.js";


//Valida se o id do contrato já está cadastrado.
async function verify_project_exists(number_contract) {
    
    try {
        return prisma.project.findFirst({
            where: {number_contract}
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}
//Valida se já existe um projeto com o mesmo nome cadastrado
async function name_project_exists(project_name) {
    try {
        return prisma.project.findFirst({
            where:{name: project_name}
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
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

//Retorna o projeto pelo id
async function get_project_by_id(project_id) {
    try {
        return prisma.project.findFirst({
            where:{id: Number(project_id)}
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

//Retorna o projeto pelo status
async function get_project_by_status(status){
    try {
        return prisma.project.findMany({
            where: {status : status},
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
            firm_id: Number(firm_id)
        }
       }) 
    } catch (error) {
        throw new Error(error.message);
        
    }
}
const project_repository = {
    verify_project_exists, create_project, name_project_exists, get_all_projects, get_project_by_id, get_project_by_status, get_project_by_firm_id}

export default project_repository;
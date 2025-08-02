import prisma from "../database/prismaClient.js";

async function verify_project_exists(number_contract) {
    
    try {
        return prisma.project.findFirst({
            where: {number_contract}
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function name_project_exists(project_name) {
    try {
        return prisma.project.findFirst({
            where:{name: project_name}
        })
        
    } catch (error) {
        throw new Error(error.message);
    }
}

async function create_project(data) {
    try {
        return prisma.project.create({
            data: {
      name: data.name,
      number_contract: data.number_contract ,
      description: data.description,
      estimated_price: data.estimated_price,
      start_date : data.start_date,
      estimated_end_date: data.estimated_end_date
            }
        })
        
    } catch (error) {
        throw new Error(error.message);
        
    }
}


async function get_all_projects() {
    try {
       return prisma.project.findMany({
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function get_project_by_id(project_id) {
    try {
        return prisma.project.findFirst({
            where:{id: Number(project_id)}
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}
const project_repository = {
    verify_project_exists, create_project, name_project_exists, get_all_projects, get_project_by_id
}

export default project_repository;
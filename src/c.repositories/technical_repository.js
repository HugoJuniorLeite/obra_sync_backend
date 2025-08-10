import prisma from "../database/prismaClient.js";

async function create_technical(project_id, data) {
    try {
        return prisma.technical.create({
            data: {
                employee_id: Number(data.employee_id),
                service_id: Number(data.service_id),
                project_id: Number(project_id)
            }
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function technical_by_project(project_id) {
    if (!project_id || project_id === null) {
        throw new Error("Dados do projeto inválidos");
        };
    try {
        return prisma.technical.findMany({
            where:{
                project_id: Number(project_id)
            }
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function technical_by_service(service_id, project_id) {
    if (!service_id || service_id === null) {
        throw new Error("Dados do serviço inválidos");
        };
    try {
        return prisma.technical.findMany({
            where:{
                service_id: Number(service_id),
                project_id: Number(project_id)
            }
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function technical_by_id(technical_id) {
    try {
        return await prisma.technical.findFirst({
           where: {
            id: Number(technical_id)
           } 
        })
    } catch (error) {
        throw new Error(error.message);
    }
}
const technical_repository = {
    technical_by_id, create_technical, technical_by_project, technical_by_service
}

export default technical_repository
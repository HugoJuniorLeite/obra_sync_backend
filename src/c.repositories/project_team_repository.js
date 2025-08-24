import prisma from "../database/prismaClient.js";

async function create_project_team(project_id, employee_id) {
    if (!project_id || project_id === undefined || !employee_id || employee_id === undefined) {
        throw new Error("Obrigatório informar dados válidos");        
    }
    try {
        return prisma.project_team.create({
            data: {
                project_id:Number(project_id),
                employee_id: Number(employee_id)
            }
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}
async function get_project_by_employee(employee_id) {
    console.log(employee_id, "project team");
    
    try {
        return prisma.findFirst({
            where: {employee_id: Number(employee_id)}
        })
    } catch (error) {
        throw new Error(error.message);
    }
}

const project_team_repository = {
    get_project_by_employee, create_project_team
}

export default project_team_repository;
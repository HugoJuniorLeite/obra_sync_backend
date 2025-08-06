import prisma from "../database/prismaClient.js";

//Criar novo serviço
async function create_service(data) {
    console.log(data, "repository");
    
    try {
        return prisma.service.create({
           data:{
               name: data.name,
               description: data.description,
               price: Number(data.price),
               project_id: Number(data.project_id)
            } 
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function get_service_by_name(service_name, project_id) {
    try {
       return prisma.service.findFirst({
where:{
name: service_name,
project_id: Number(project_id)
}
       }) 
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function get_all_services(project_id) {
    try {
        return prisma.service.findMany({
            where: {project_id: Number(project_id)}
        })
    } catch (error) {
        throw new Error(error.message);
        }
}

async function get_service_by_id(id) {
    try {
        return prisma.service.findFirst({
            where: { id: Number(id)}
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function update_service_id(service_id, data) {
    
   const update_data = {};
  if (data.name !== undefined) update_data.name = data.name;
  if (data.description !== undefined) update_data.description = data.description;
  if (data.price !== undefined) update_data.price = data.price;
  if (data.project_id !== undefined) update_data.project_id = data.project_id;
 
 
  if (Object.keys(update_data).length === 0) {
    throw new Error('Nenhum campo para atualizar foi fornecido.');
  }

  try {
    const updated = await prisma.service.update({
      where: { id: Number(service_id) },
      data: update_data,
    });
    return updated;
  } catch (error) {

    throw new Error(error.message);
  }
}

async function deactivate_service(service_id) {
    return prisma.service.update({
        where: {id: Number(service_id)},
        data: {active: false}
    })
}


const service_repository = {
    create_service, get_all_services, get_service_by_id, update_service_id, deactivate_service, get_service_by_name
}

export default service_repository;
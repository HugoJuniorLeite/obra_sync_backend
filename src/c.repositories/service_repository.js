import occupation_service from "../b.services/occupation_service.js";
import prisma from "../database/prismaClient.js";

async function create_service(data) {
    console.log(data.occupation_ids, "repository service");
    
try {
  return await prisma.service.create({
    data: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      project_id: Number(data.project_id),
     occupations: {
      create: (data.occupation_ids ||[]).map((occupation_id) => ({
        occupation: { connect: { id: occupation_id } }
      }))
        }
    }
  })
} catch (error) {
  throw new Error(error.message)
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
            where: {project_id: Number(project_id)},
            include: {
                occupations: true
            }
        })
    } catch (error) {
        throw new Error(error.message);
        }
}

async function get_service_by_id(id) {
    try {
        return prisma.service.findFirst({
            where: { id: Number(id)},
            include: {
                occupations: true
            }
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

export async function update_service_id(service_id, data) {
  // Atualiza campos simples
  const update_data = {};
  if (data.name !== undefined) update_data.name = data.name;
  if (data.description !== undefined) update_data.description = data.description;
  if (data.price !== undefined) update_data.price = Number(data.price);
  if (data.project_id !== undefined) update_data.project_id = Number(data.project_id);

  if (Object.keys(update_data).length > 0) {
    await prisma.service.update({
      where: { id: Number(service_id) },
      data: update_data
    });
  }

  // Atualiza occupations (tabela pivô)
  if (data.occupation_ids && Array.isArray(data.occupation_ids)) {
    // 1. Remove occupations que não estão mais no array
    await prisma.occupation_service.deleteMany({
      where: {
        service_id: Number(service_id),
        occupation_id: { notIn: data.occupation_ids }
      }
    });

    // 2. Adiciona novas occupations
    const existing = await prisma.occupation_service.findMany({
      where: { service_id: Number(service_id) },
      select: { occupation_id: true }
    });

    const existingIds = existing.map(e => e.occupation_id);
    const toCreate = data.occupation_ids.filter(id => !existingIds.includes(id));

    if (toCreate.length > 0) {
      await prisma.occupation_service.createMany({
        data: toCreate.map(id => ({
          service_id: Number(service_id),
          occupation_id: id
        })),
        skipDuplicates: true
      });
    }
  }

  // Retorna service atualizado com occupations
  return prisma.service.findUnique({
    where: { id: Number(service_id) },
    include: { occupations: { include: { occupation: true } } }
  });
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
import prisma from "../database/prismaClient.js";

async function create_occupation(data) {
let total_salary = parseFloat(data.salary);

if (data.dangerousness) {
  total_salary *= 1.30; // aumenta 30%
}
  
    try {
     return prisma.occupation.create({
        data:{
            name: data.name,
            description_of_occupation : data.description_of_occupation,
            salary: data.salary,
            dangerousness : data.dangerousness,
            total_salary: total_salary
        }
     })
    } catch (error) {
        throw new Error(error.message);
        }
}

async function get_all_occupations() {
    try {
        return prisma.occupation.findMany({
            });

    } catch (error) {
        throw new Error(error.message);
        }
}

async function get_occupation_by_id(occupation_id) {
    try {
      return prisma.occupation.findFirst({
        where: {
            id: Number(occupation_id)
        }
      }) 
    } catch (error) {
        throw new Error(error.message);
        }
}

async function verify_occupation_exists(occupation_name) {
    try {
        return prisma.occupation.findFirst({
            where: {
                name: occupation_name
            }
        })
    } catch (error) {
        throw new Error(error.message);
        }
}

async function update_occupation_id(occupation_id, data) {
    
   const update_data = {};
  if (data.name !== undefined) update_data.name = data.name;
  if (data.description_of_occupation !== undefined) update_data.description_of_occupation = data.description_of_occupation;
  if (data.dangerousness !== undefined) update_data.dangerousness = data.dangerousness;
  if (data.salary !== undefined) update_data.salary = data.salary;
  if (Object.keys(update_data).length === 0) {
    throw new Error('Nenhum campo para atualizar foi fornecido.');
  }

  try {
    const updated = await prisma.occupation.update({
      where: { id: Number(occupation_id) },
      data: update_data,
    });
    return updated;
  } catch (error) {

    throw new Error(error.message);
  }
}

async function deactivate_occupation(occupation_id) {
    return prisma.occupation.update({
        where: {id: Number(occupation_id)},
        data: {active: false}
    })
}

const occupation_repository = {
    create_occupation, get_all_occupations, deactivate_occupation,get_occupation_by_id, verify_occupation_exists, update_occupation_id
}

export default occupation_repository;
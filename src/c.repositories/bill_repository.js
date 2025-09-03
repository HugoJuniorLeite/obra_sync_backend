import prisma from "../database/prismaClient.js";

async function verify_customer_exists(data) {
  return await prisma.customer.findFirst({
    where: {
      name: data.name,
      phone: data.phone
    }
  })
}
async function create_customer(customer) {
 
    
  return await prisma.customer.create({
    data: {
      name: customer.name,
      phone: customer.phone
    }
  });
};

async function create_customer_address(customer_address, customer_id) {
       
  return await prisma.customer_address.create({
    data: {
      zip_code: customer_address.zip_code,
      street: customer_address.street,
      number: Number(customer_address.number),
      neighborhood: customer_address.neighborhood,
      city: customer_address.city,
      state: customer_address.state,
      customer: {
        connect: { id: customer_id }
      }
    }
  });
}

async function create_extension_address(data_extension_address, customer_id) {
  return await prisma.extension_address.create({
    data: {
      zip_code: data_extension_address.zip_code,
      street: data_extension_address.street,
      number: Number(data_extension_address.number),
      neighborhood: data_extension_address.neighborhood,
      city: data_extension_address.city,
      state: data_extension_address.state,
      customer: {
        connect: { id: customer_id }
      }
    }
  });
}

async function create_consultant(data_consultant) {
   
  return await prisma.consultant.create({
    data: {
      name: data_consultant.name,
      phone: data_consultant.phone
    }
  });
}

async function create_bill(create_customer_id, create_customer_adress_id, create_extension_address_id, create_consultant_id, project_id, service_id) {
  
  return await prisma.bill.create({
    data: {
      customer_id: create_customer_id,
      customer_address_id: create_customer_adress_id,
      extension_address_id: create_extension_address_id,
      consultant_id: create_consultant_id,
      project_id: project_id,
      service_id: service_id,
  }
  });
}

async function change_status_bill(data, bill_id) {
   console.log(data, bill_id, "repo");
  try {
    const updateData = {};

    if (data.status) {
      updateData.status = data.status
    }

    return await prisma.bill.update({
      where: { id: Number(bill_id) },
      data: updateData
    });

  } catch (error) {
    throw new Error(error.message);
  }
}


async function dispatch_bill(data, bill_id) {
   console.log(data, bill_id, "repo");
  try {
    const updateData = {};

    if (data.technical_id) {
      updateData.technical_id = Number(data.technical_id);
    }

    if (data.scheduled_at) {
      updateData.scheduled_at = new Date(data.scheduled_at);
    }

    updateData.status = "despachada";

    return await prisma.bill.update({
      where: { id: Number(bill_id) },
      data: updateData
    });

  } catch (error) {
    throw new Error(error.message);
  }
}

async function bill_filtered(status, project_id, technical_id) {
  
  try {
    return await prisma.bill.findMany({
      where: {
        ...(status && { status: String(status) }),
        ...(project_id && { project_id: Number(project_id) }),
        ...(technical_id && { technical_id:  Number(technical_id) 
})      
      },
      include: {
        consultant: true,
        customer_address: true,
        customer: true,
        extension_address: true,
        project: true,
        service: true,
      },
      orderBy: {
        created_at: "asc"
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function get_technical_by_occupation_id(project_id, occupation_ids) {
  console.log(occupation_ids, project_id, "occupation_ids");

  try {
    return await prisma.employee.findMany({
      where: {
        occupation_id: { in: occupation_ids },
        project_team: {
          some: {
            project_id: Number(project_id),
          }
        }
      },
      include: {
        occupation: true,
        project_team: true 
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
}


async function bill_by_id(bill_id) {
  try {
    return await prisma.bill.findFirst({
      where: {
        id: Number(bill_id)
      },
      include: {
        consultant: true,
        customer: true,
        customer_address: true,
        extension_address: true
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function get_occupation_employee(employee_id) {
  try {
    return prisma.employee.findFirst({
      where: { employee_id: Number(employee_id)}
    })
  } catch (error) {
    throw new Error(error.message);
  }
}

async function get_service_by_occupation(occupation_id) {
  try {
    return prisma.occupation_service.findMany({
      where: {
        occupation_id: Number(occupation_id)
      }
    })
  } catch (error) {
    throw new Error(error.message);
  }
}

async function get_occupation_ids() {
  try {
    return await prisma.occupation_service.findMany({

    })
  } catch (error) {
    throw new Error(error.message);
  }
}

async function get_bills_by_technical(project_id, service_ids) {
  console.log(project_id, service_ids);
  
  return await prisma.bill.findMany({
    where: {
      ...(project_id ? { project_id: Number(project_id) } : {}),
      ...(service_ids?.length ? { service_id: { in: service_ids.map(Number) } } : {}),
      status: { in: ["aberta", "devolvida"] },
    },
    include: {
      project: true,
      service: true,
      customer_address: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

const bill_repository = {
change_status_bill ,get_bills_by_technical ,get_occupation_employee ,get_service_by_occupation ,get_technical_by_occupation_id ,get_occupation_ids ,bill_filtered ,bill_by_id, dispatch_bill, verify_customer_exists,create_customer, create_customer_address, create_extension_address, create_consultant, create_bill
}

export default bill_repository;
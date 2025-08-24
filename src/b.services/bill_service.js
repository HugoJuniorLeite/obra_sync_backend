import bill_repository from "../c.repositories/bill_repository.js";
import service_repository from "../c.repositories/service_repository.js";
import employee_repository from "../c.repositories/employee_repository.js";

async function create_bill_service(data) {

    if (!data) {
        throw new Error("Dados nulos no service");
            }
    const customer_data = data.customer.create;
    const customer_address = data.customer_address.create;
    const extension_address = data.extension_address.create;
    const consultant = data.consultant.create;
    
    try {
    console.log(customer_address, extension_address, "services");
    const create_customer = await bill_repository.create_customer(customer_data);
    const create_customer_address = await bill_repository.create_customer_address(customer_address, create_customer.id);
    const create_extension_address = await bill_repository.create_extension_address(extension_address, create_customer.id);
    const create_consultant = await bill_repository.create_consultant(consultant, create_customer.id);
    await bill_repository.create_bill(create_customer.id, create_customer_address.id, create_extension_address.id, create_consultant.id, data.project_id, data.service_id)
    return
} catch (error) {
    throw new Error(error.message);
    
}
}

async function dispatch_bill_service(data, bill_id) {
    if (!data || data === undefined || data === null) {
        throw new Error("Dados nulos no service");
            }
    try {
        const bill_exists = await bill_repository.bill_by_id(bill_id);
        if (!bill_exists || bill_exists === null || bill_exists === undefined) {
            throw new Error("Nota de atendimento não encontrada!");
            }
 console.log(bill_exists);
 console.log(data);
 
 if (bill_exists.status !== "aberta") {
    throw new Error("Não é possível despachar notas que nã estejam com status aberta");
    
 }
        await bill_repository.dispatch_bill(data, bill_exists.id)
    } catch (error) {
        throw new Error(error.message); 
    }
}

async function get_bill_filtered_service(status, project_id, technical_id) {

    const bills_by_status = await bill_repository.bill_filtered(status, project_id, technical_id)

    return bills_by_status;

}

async function get_all_technicals(project_id) {
    console.log(project_id, "service");
    
  try {
    const all_occupation_ids = await bill_repository.get_occupation_ids();

    const occupation_ids = [...new Set(
      all_occupation_ids.map(occupation => occupation.occupation_id)
    )];

    console.log(occupation_ids, "ids");

    if (occupation_ids.length === 0) {
      return []; 
    }

    const all_technicals = await bill_repository.get_technical_by_occupation_id(project_id, occupation_ids);
    return all_technicals;

  } catch (error) {
    throw new Error(error.message); 
  }
}

async function bill_by_technical(employee_id) {
    if (!employee_id) {
        throw new Error("Informe um técnico válido");
            }
    try {
        const employee_exists = await employee_repository.find_employee_by_id(employee_id);
        if (!employee_exists) {
            throw new Error("Funcionário não encontrado");
            }
                console.log(employee_exists);
                     
        const services_by_occupation = await service_repository.get_service_by_occupation(employee_exists.occupation_id);
        console.log(services_by_occupation, "servicesByOccupation");
        
     const service_ids = services_by_occupation.map(service => service.service_id);

     const filtered_bills = await bill_repository.get_bills_by_technical(projects.project_id, service_ids);
     console.log(filtered_bills);
return filtered_bills
    } catch (error) {
         throw new Error(error.message); 
    }
}

const bill_service ={
  bill_by_technical ,get_all_technicals ,create_bill_service, dispatch_bill_service, get_bill_filtered_service, 
}

export default bill_service;

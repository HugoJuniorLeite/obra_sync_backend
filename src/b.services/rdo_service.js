import rdo_repository from "../c.repositories/rdo_repository.js";

async function create_rdo_service(data) {
    if (!data) {
        throw new Error("Dados obrigatórios");
    }
    try {
        await rdo_repository.create_rdo_repository(data);
        return; // opcional: retornar objeto criado
    } catch (error) {
        throw new Error(error.message);
    }
}

async function rdo_not_executed(bill_id, data) {
    if (!data || !bill_id) {
        throw new Error("Dados incorretos!");
        }
    try {
        await rdo_repository.rdo_not_executed(bill_id, data);
        return
    } catch (error) {
        throw new Error(error.message);
    }
}

async function get_rdo_by_bill_id_service(bill_id) {
    if (!bill_id) {
        throw new Error("Dados inválidos");
            }
    const rdo_by_bill_id = await rdo_repository.get_rdo_by_bill_id(bill_id);
    if (!rdo_by_bill_id) {
        throw new Error("Não há RDO cadastrado para a nota solicitada");
            }
    return rdo_by_bill_id;
}

async function get_rdo_by_project_id_service(project_id) {
    if (!project_id) {
        throw new Error("Projeto inválido");
        }
        try {
            const bill_by_project = await rdo_repository.get_bill_by_project(project_id);
        const ids = bill_by_project.map((bill)=> {return bill.id}) 
      
     const rdo_list = await Promise.all(ids.map((rdo_id) =>
        rdo_repository.get_rdo_by_bill_id(rdo_id)
    ))
    if (rdo_list.length === 0) {
        throw new Error("Nenhum RDO cadastrado nesse projeto!");
        
    }
 return rdo_list;
    
        } catch (error) {
            throw new Error(error.message);
            
        }


}

const rdo_service = {
    create_rdo_service, rdo_not_executed, get_rdo_by_bill_id_service, get_rdo_by_project_id_service
};

export default rdo_service;

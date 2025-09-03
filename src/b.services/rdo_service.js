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

const rdo_service = {
    create_rdo_service,
};

export default rdo_service;

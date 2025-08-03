import firm_repository from "../c.repositories/firm_repository.js";


async function register_new_firm_service(firm) {
    
    try {
        await firm_repository.register_firm(firm)
    } catch (error) {
        throw new Error(error.message);
        
    }
}

async function get_firms() {
    
    try {
        const all_firms = await firm_repository.get_firms();
        return all_firms;
    } catch (error) {
        
    }
}

async function firm_by_id(id) {
    try {
        const selected_firm = await firm_repository.get_firm_by_id(id);
        return selected_firm;
    } catch (error) {
        throw new Error(error.message);
        
    }}

const firm_service = {
    register_new_firm_service, get_firms, firm_by_id
}

export default firm_service;
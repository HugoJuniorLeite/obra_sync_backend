import employee_service from "../b.services/employee_service.js";

async function register_employee_controller(req, res) {
    const data = req.body
    console.log(data, "controller");
    
       try {
        if (!data || data === undefined) {
            }
        await employee_service.register_employee(data)
        res.status(201).json({message:"Cadastro criado com sucesso!"})
    } catch (error) {
        console.log(error);
        
        return res.status(error.status || 400).json({message: error.message})
    }
    
}

async function find_employee_by_project_controller(req, res) {
    const project_id = req.params.project_id;
    try {
        if (!project_id || project_id === undefined) {
            return res.status(error.status || 400).json({message: error.message})
        }
        const employee_by_project = await employee_service.find_employee_by_project_service(project_id);
res.status(200).send(employee_by_project)
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
}

async function update_employee_controller(req, res) {
    const data = req.body;
    const employee_id = req.params.employee_id;
    try {
        if (!data || !employee_id || data === undefined || employee_id === undefined) {
        return res.status(error.status || 400).json({message: error.message})
        }
        await employee_service.update_employee(employee_id, data);
        res.status(200).send("Dados atualizados com sucesso")
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
}

async function delete_employee(req, res){
    const employee_id = req.params.employee_id;
    try {
        if (!employee_id || employee_id === undefined) {
        return res.status(error.status || 400).json({message: error.message})
        }
        await employee_service.delete_employee(employee_id)
        res.status(200).send("Dados atualizados com sucesso")
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
}

const employee_controller = {
    register_employee_controller, delete_employee, find_employee_by_project_controller, update_employee_controller
}
export default employee_controller;
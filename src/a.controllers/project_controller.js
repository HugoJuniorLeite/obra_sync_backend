import project_service from "../b.services/project_services.js";

async function create_project_controller(req, res) {
    const data = req.body;
    console.log(data, "controller");
    
    try {
        await project_service.create_project_service(data);
        res.status(201).send({message: "Projeto inserido com sucesso"})
    } catch (error) {
        console.log(error, "error controller");
        
         return res.status(error.status || 400).json({message: error.message});
    }
}

async function get_all_projects_controller(req, res) {

    try {
        const all_projects = await project_service.get_all_projects_service()
        if (all_projects.lenght === 0 || all_projects === null) {
            throw new Error("Não há projetos cadastrados");
            }
     
        res.status(200).send(all_projects);
    } catch (error) {
      return res.status(error.status || 400).json({message: error.message});  
    }

}

async function get_project_by_id_controller(req, res) {
   const project_id = req.params.project_id;
   console.log(project_id);
   
   
   try {
    const selected_project = await project_service.get_project_by_id_service(project_id)
res.status(200).send(selected_project);  
} catch (error) {
     return res.status(error.status || 400).json({message: error.message});  
   }
   
}

const project_controller = {
    create_project_controller, get_all_projects_controller, get_project_by_id_controller
}
export default project_controller;
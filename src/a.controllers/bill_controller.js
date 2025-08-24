import bill_service from "../b.services/bill_service.js";

async function create_bill_controller(req,res) {
    const data = req.body;
    console.log(data, "controller");
    
    if (!data || data === undefined) {
        throw new Error("Obrigatório informar dados válidos");
            }
    try {
        await bill_service.create_bill_service(data);
        res.status(201).send("Cadastro realizado com sucesso!")
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
}

async function dispatch_bill_controller(req, res) {
    const data = req.body;
    const bill_id = req.params.bill_id;
    console.log(data, "data");
    console.log(bill_id, "id");
    
    
    try {
        await bill_service.dispatch_bill_service( data, bill_id);
        res.status(201).send("Nota despachada com sucesso!")
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
}

async function get_all_technicals(req,res) {
   
console.log(project_id);

    try {
        const all_technicals = await bill_service.get_all_technicals(project_id);
    res.status(200).send(all_technicals);
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message}) 
    }
}

async function get_bill_filtered_controller(req, res) {
    const {status, project_id, technical_id} = req.query;


try {
  const bill_by_status = await bill_service.get_bill_filtered_service(status, project_id, technical_id);
  res.status(200).send(bill_by_status) 
} catch (error) {
 return res.status(error.status || 400).json({message: error.message})   
}
}

async function get_bill_by_technical(req, res) {
  const {employee_id} = req.params;
  console.log(employee_id,"controller");
  
if (!employee_id) {
    return res.status(400).send("É necessário inserir dados válidos!")
}

  try {
    const bill_by_technical = await bill_service.bill_by_technical(employee_id)
return res.status(200).send(bill_by_technical);  
} catch (error) {
    return res.status(error.status || 400).json({message: error.message})   
  }
    
}

async function change_status_bill_controller(req, res) {
    const data = req.body;
    const {bill_id} = req.params;
       if (!data || ! bill_id) {
        throw new Error("Dados Inválidos");
        }
    try {
        await bill_service.change_status_bill_service(data, bill_id)
   res.status(200).send("Nota aceita com sucesso!");
    } catch (error) {
         return res.status(error.status || 400).json({message: error.message})   
    }
}

async function get_bill_by_id_controller(req, res) {
    const {bill_id} = req.params;
    if (!bill_id) {
        throw new Error("Dados Inválidos");
    }
    try {
        const selected_bill = await bill_service.get_bill_by_id(bill_id);
        res.status(200).send(selected_bill)
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})   
    }

}

const bill_controller = {
 get_bill_by_id_controller ,change_status_bill_controller ,get_bill_by_technical ,get_all_technicals ,create_bill_controller, dispatch_bill_controller, get_bill_filtered_controller
}

export default bill_controller;
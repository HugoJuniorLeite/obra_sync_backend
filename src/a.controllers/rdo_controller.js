import rdo_service from "../b.services/rdo_service.js";
import multer from "multer";
import supabase from "../supabaseClient.js";

const upload = multer({ storage: multer.memoryStorage() });

// Função para enviar um arquivo para Supabase e retornar URL pública
async function upload_photo_to_supabase(file) {
    const { data, error } = await supabase.storage
        .from("photos")
        .upload(`project/${Date.now()}_${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
        });

    if (error) throw error;

    const { data: public_url } = supabase.storage
        .from("photos")
        .getPublicUrl(data.path);

    return public_url.publicUrl;
}

// Middleware para aceitar múltiplos arquivos
export const upload_photos_middleware = upload.fields([
    { name: "fotoCalcadaAntes" },
    { name: "fotoCroqui" },
    { name: "fotoFrenteImovel" },
    { name: "fotoPlacaRua" },
    { name: "fotoProtecaoMecanica" },
    { name: "fotoProvisorio" },
    { name: "fotoRamalCortado" },
    { name: "fotoRamalExposto" },
]);

// Mapeia campos do JSON em português para inglês
function map_fields_to_english(data, fotosUrls) {
    return {
        pipe_branch_diameter: data.diametroRamal,
        pipe_network_diameter: data.diametroRede,
        signal_tape: data.faixaSinalizacao === "true",
        cut_location: data.localCorte,
        branch_material: data.materialRamal,
        network_material: data.materialRede,
        branch_position: data.posicaoRamal,
        network_pressure: data.pressaoRede || null,
        mechanical_protection: data.protecaoMecanica === "true",
        cut_branch: data.ramalCortado,
        round_tachao: data.tachaoRedondo === "true",
        capping_type: data.tipoCapeamento,
        branch_type: data.tipoRamal,
        bill_id: data.billId,
        components: data.componentes || [],
        welds: data.soldas || [],
        trenches: data.valas || [],
        photos: fotosUrls || {},
        resultado: data.resultado
    };
}

// Controller principal
async function create_rdo_controller(req, res) {
    try {
        const body = JSON.parse(req.body.data); // JSON enviado pelo frontend
        const files = req.files || {};
        const fotosUrls = {};

        // Upload das fotos e mapeamento
        for (const key in files) {
            fotosUrls[key] = await upload_photo_to_supabase(files[key][0]);
        }

        // Mapeia o JSON para inglês
        const mapped_body = map_fields_to_english(body, fotosUrls);
console.log("Body recebido:", body);
console.log("Body mapeado:", mapped_body);

        const created_rdo = await rdo_service.create_rdo_service(mapped_body);
        res.status(200).send(created_rdo);
    } catch (error) {
        console.error(error);
        return res.status(error.status || 400).json({ message: error.message });
    }
}

async function rdo_not_executed(req, res) {
const data = req.body;
const {bill_id }= req.params
console.log(data, bill_id);

try {
    await rdo_service.rdo_not_executed(bill_id, data);
    res.status(201).send("Nota não executada. Seu gestor será notificado.")
} catch (error) {
    return res.status(error.status || 400).json({ message: error.message });
}
}

async function get_rdo_by_bill_id_controller(req, res) {
    const {bill_id} = req.params;
    if (!bill_id) {
        throw new Error("Dados inválidos");
            }
            try {
                const rdo_by_bill = await rdo_service.get_rdo_by_bill_id_service(bill_id);
                return res.status(200).send({rdo: rdo_by_bill});
            } catch (error) {
                return res.status(error.status || 400).json({ message: error.message });
            }

}

async function get_rdo_by_project_controller(req, res) {
    const {project_id} = req.params;
    if (!project_id) {
        throw new Error("Projeto inválido!");
            }
    try {
        const rdo_list_by_project = await rdo_service.get_rdo_by_project_id_service(project_id);
        return res.status(200).send({rdo_list: rdo_list_by_project})
    } catch (error) {
        return res.status(error.status || 400).json({ message: error.message });
    }
}
const rdo_controller = {
    create_rdo_controller, rdo_not_executed, get_rdo_by_bill_id_controller, get_rdo_by_project_controller
};

export default rdo_controller;

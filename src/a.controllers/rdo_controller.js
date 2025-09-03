// import rdo_service from "../b.services/rdo_service.js";

// async function create_rdo_controller(req, res) {
//     const data = req.body;
//     if (!data) {
//         return res.status(error.status || 400).json({message: error.message});
//     }
//     try {
//        const created_rdo = await rdo_service.create_rdo_service(data);
//         res.status(200).send(created_rdo);
//     } catch (error) {
//         return res.status(error.status || 400).json({message: error.message});      
//     }
// }

// const rdo_controller = {
//     create_rdo_controller,
// };

// export default rdo_controller;

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

const rdo_controller = {
    create_rdo_controller,
};

export default rdo_controller;

import rdo_service from "../b.services/rdo_service.js";
import multer from "multer";
import supabase from "../supabaseClient.js";
import PDFDocument from 'pdfkit';
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios"
import fs from "fs";

const upload = multer({ storage: multer.memoryStorage() });

async function upload_photo_to_supabase(file) {
  // Faz upload
  const { data, error } = await supabase.storage
    .from("photos")
    .upload(`project/${Date.now()}_${file.originalname}`, file.buffer, {
      contentType: file.mimetype,
      upsert: false, // evita sobrescrever
    });

  if (error) {
    console.error("Erro ao enviar arquivo:", error);
    throw error;
  }

  if (!data || !data.path) {
    throw new Error("Upload não retornou caminho do arquivo.");
  }

  // Gera URL pública
  const { data: publicData } = supabase.storage
    .from("photos")
    .getPublicUrl(data.path);

  if (!publicData || !publicData.publicUrl) {
    throw new Error("Não foi possível gerar a URL pública.");
  }

  return publicData.publicUrl;
}


// Middleware para aceitar múltiplos arquivos
export const upload_photos_middleware = upload.fields([
    { name: "fotoCalcadaAntes" },
    { name: "fotoFrenteImovel" },
    { name: "fotoPlacaRua" },
    { name: "fotoProtecaoMecanica" },
    { name: "fotoProvisorio" },
    { name: "fotoRamalCortado" },
    { name: "fotoRamalExposto" },
    { name: "fotoTachao" },
    { name: "fotoCroqui" }, // opcional: croqui em foto
]);

// Função para mapear croquis do RDO
function map_street_data(data = {}) {
    const campos = data.campos ? Object.values(data.campos)[0] : {};

    return {
      total_width: campos.largura_total || null,
      left_distance: campos.distancia_esquerda || null,
        name: data.key || null,
        branch_cut: campos.ramalCortado || null,
        cut_location: campos.localCorte || null,
        left_street: campos.Rua_esquerda || null,
        center_street: campos.Rua_centro || null,
        right_street: campos.Rua_direita || null,
        left_point_a: campos.A_esquerda || null,
        right_point_a: campos.A_direita || null,
        B_point: campos.B || null,
        pg_number: campos.Pg || null,
        street_width: campos.Largura_logradouro || null,
        PC_POS_VGB: campos.PCPOSVGB || null,
        PVGB: campos.PVGB || null,
        VGB_distance: campos.Distancia_VGB_predial || null,
        CPOSVGB_distance: campos.Distancia_CPOSVGB_predial || null,
        PC_PRE_VGB: campos.PCPREVGB || null,
        CP_PRE_VGB_distance: campos.CPREVGB_predial || null,
        right_number: campos.Numero_direita || null,
        left_number: campos.Numero_esquerda || null,
        center_number : campos.Numero_centro || null,
        CPC_predial: campos.CPC_predial || null,
        PCRA: campos.PCRA || null,
        point_q: campos.Q || null,
        point_p: campos.P || null,
        point_r:campos.R || null,
        point_g:campos.G || null,
        point_s: campos.S || null,
        point_h: campos.H || null,
        point_g_right: campos.G_direira || null,
        point_g_left: campos.G_esquerda || null,
        PVGB_left: campos.PVGB_esquerda || null,
        PVGB_right: campos.PVGB_direita || null,
        PCPOSVGB_left: campos.PCPOSVGB_esquerda || null,
         PCPOSVGB_right: campos.PCPOSVGB_esquerda || null,
        point_o: campos.O || null,
        PCRA_left: campos.PCRA_esuqerda || null,
        point_n: campos.N || null,
    };
}

// Função para mapear dados do JSON em português para inglês
function map_fields_to_english(data, fotosUrls = {}) {
    return {
     
      total_width: data.largura_total,
      left_distance: data.distancia_esquerda,
      PVGB_left: data.PVGB_esquerda,
      PVGB_right: data.PVGB_direita,
      PCRA: data.PCRA,
      point_p: data.point_p,
      point_q: data.point_q,
      CPC_predial: data.CPC_predial,
        center_number : data.Numero_centro,
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
        bill_id: data.id,
        flow_valve_type: data.valvFluxo || null,
        components: data.componentes || [],
        welds: data.soldas || [],
        trenches: data.valas || [],
        street_data: data.croquis ? map_street_data(data.croquis) : null,
        photos: {
            sidewalk_before: fotosUrls.fotoCalcadaAntes || null,
            sketch: fotosUrls.fotoCroqui || null,
            front_house: fotosUrls.fotoFrenteImovel || null,
            street_sign: fotosUrls.fotoPlacaRua || null,
            mechanical_protection: fotosUrls.fotoProtecaoMecanica || null,
            provisional: fotosUrls.fotoProvisorio || null,
            cut_branch: fotosUrls.fotoRamalCortado || null,
            exposed_branch: fotosUrls.fotoRamalExposto || null,
            tachao: fotosUrls.fotoTachao || null
        },
        resultado: data.resultado
    };
}

// Controller principal
export async function create_rdo_controller(req, res) {
  //  console.log(req.files, "Fotos");
    console.log(req.body, "Recebido do front");
    
    try {
        if (!req.files) {
            return res.status(400).json({ error: 'Nenhum arquivo recebido' });
        }

        const body = JSON.parse(req.body.data);
        const files = req.files || {};
        const fotosUrls = {};

        // Upload de todas as fotos primeiro
        for (const fieldName in files) {
            const file = files[fieldName][0]; // obrigatório [0]
            fotosUrls[fieldName] = await upload_photo_to_supabase(file);
        }

        // Mapear campos do body
        const mapped_body = map_fields_to_english(body, fotosUrls);
        console.log("Mapped body final:", mapped_body);

        // Criar RDO
        const created_rdo = await rdo_service.create_rdo_service(mapped_body);

        return res.status(201).json({
            message: "RDO criado com sucesso!",
            fotos: fotosUrls,
            rdo: created_rdo
        });

    } catch (error) {
        console.error("❌ Erro no controller:", error);
        return res.status(500).json({ message: error.message });
    }
}  

async function rdo_not_executed(req, res) {
const data = req.body;
const {bill_id }= req.params
// console.log(data, bill_id);

try {
    await rdo_service.rdo_not_executed(bill_id, data);
    res.status(201).send("Nota não executada. Seu gestor será notificado.")
} catch (error) {
    return res.status(error.status || 400).json({ message: error.message });
}
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generate_rdo_pdf_controller(req, res) {
  const { bill_id } = req.params;

  try {
  const doc = new PDFDocument({
  size: "A4",
  margins: { top: 60, bottom: 60, left: 72, right: 72 }
});
    // const doc = new PDFDocument({ margin: 50, size: "A4" });
const rdoData = await rdo_service.get_rdo_by_bill_id_service(bill_id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=RDO_${bill_id}.pdf`);
    doc.pipe(res);
console.log(rdoData, "rdo Data");

    // === Carregar imagem de fundo ===
    const bgPath = path.join(__dirname, "../assets/first_image.png");
doc.image(bgPath, 0, 0, {
  width: doc.page.width,
  height: doc.page.height / 2.36
});
      doc
      .rect(111, 45, 10, 5) // x, y, largura, altura
      .fill("black");
       const bill = rdoData.bill || {};
if (bill.customer_address) {
  doc
    .fontSize(12)
    .fillColor("black")
    .text(
      `${bill.customer_address.street || "-"}, ${bill.customer_address.number || "-"}`,
      60, // posição X (coluna)
      80  // posição Y (linha)
    );
};
if (bill.customer_address.zip_code) {
  doc
    .fontSize(12)
    .fillColor("black")
    .text(
      `${bill.customer_address.zip_code || "-"}`,
      400, // posição X (coluna)
      80  // posição Y (linha)
    );
};
if (bill.customer_address.neighborhood) {
  doc
    .fontSize(12)
    .fillColor("black")
    .text(
      `${bill.customer_address.neighborhood|| "-"}`,
      60, // posição X (coluna)
      110  // posição Y (linha)
    );
};

if (bill.customer_address.city) {
  doc
    .fontSize(12)
    .fillColor("black")
    .text(
      `${bill.customer_address.city|| "-"}`,
      230, // posição X (coluna)
      110  // posição Y (linha)
    );
};
function formatarDataBR(data) {
  if (!data) return "-";
  const d = new Date(data);
  const dia = String(d.getUTCDate()).padStart(2, "0");
  const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
  const ano = d.getUTCFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Uso no PDF
if (bill.service_completed_at) {
  doc
    .fontSize(12)
    .fillColor("black")
    .text(
      `${formatarDataBR(bill.service_completed_at)}`,
      60, // posição X (coluna)
      142  // posição Y (linha)
    );
}

if (bill.id) {
  doc
    .fontSize(12)
    .fillColor("black")
    .text(
      `${bill.id}`,
      230, // posição X (coluna)
      142  // posição Y (linha)
    );
}
//Preenchimento dos campos conforme a resposta
//Pressão de rede
if (rdoData.network_pressure === "250mbar") {
    doc
      .rect(66, 170, 9, 4.5) // x, y, largura, altura
      .fill("black");
    }
    if (rdoData.network_pressure === "75mbar") {
    doc
      .rect(66, 175.5, 9, 4.5) // x, y, largura, altura
      .fill("black");
    }
    if (rdoData.network_pressure === "100mbar") {
    doc
      .rect(66, 182,9, 4.5) // x, y, largura, altura
      .fill("black");
    }
    if (rdoData.network_pressure === "350mbar") {
    doc
      .rect(66, 190, 9, 4.5) // x, y, largura, altura
      .fill("black");
    }
    if (rdoData.network_pressure === "1Bar") {
    doc
      .rect(66, 198, 10, 5) // x, y, largura, altura
      .fill("black");
    }
    if (rdoData.network_pressure === "4mbar") {
    doc
      .rect(105, 170, 10, 5) // x, y, largura, altura
      .fill("black");
    }
     if (rdoData.network_pressure === "7bar") {
    doc
      .rect(105, 175.5, 10, 5) // x, y, largura, altura
      .fill("black");
    }
     if (rdoData.network_pressure === "17bar") {
    doc
      .rect(105, 182.9, 10, 5) // x, y, largura, altura
      .fill("black");
    }
     if (rdoData.network_pressure === "35bar") {
    doc
      .rect(105, 190, 10, 5) // x, y, largura, altura
      .fill("black");
    }

//Válvula de Fluxo
 if (rdoData.flow_valve_type == true) {
    doc
      .rect(150,174.5, 10, 5) // x, y, largura, altura
      .fill("black");
    }
if (rdoData.flow_valve_type == false) {
    doc
      .rect(150, 189, 10, 5) // x, y, largura, altura
      .fill("black");
    }
//Material de Rede
 if (rdoData.network_material === "Aço") {
    doc
      .rect(225,172.5, 10, 5) // x, y, largura, altura
      .fill("black");
    }

     if (rdoData.network_material === "PE80") {
    doc
      .rect(225,179, 10, 5) // x, y, largura, altura
      .fill("black");
    }

     if (rdoData.network_material === "PE100") {
    doc
      .rect(225,184.5, 10, 5) // x, y, largura, altura
      .fill("black");
    }

     if (rdoData.network_material === "outro") {
    doc
      .rect(225,192, 10, 5) // x, y, largura, altura
      .fill("black");
    }

    //Diâmetro de Rede
 if (rdoData.pipe_network_diameter === "40mm") {
    doc
      .rect(309,169, 10, 5) // x, y, largura, altura
      .fill("black");
    }

     if (rdoData.pipe_network_diameter === "63mm") {
    doc
      .rect(309,183, 10, 5) // x, y, largura, altura
      .fill("black");
    }

     if (rdoData.pipe_network_diameter === "125mm") {
    doc
      .rect(349,169, 10, 5) // x, y, largura, altura
      .fill("black");
    }

     if (rdoData.pipe_network_diameter === "90mm") {
    doc
      .rect(349,183, 10, 5) // x, y, largura, altura
      .fill("black");
    }

    if (rdoData.pipe_network_diameter === "outro") {
    doc
      .rect(309,197.5, 10, 5) // x, y, largura, altura
      .fill("black");
    }
    //Material do Ramal

    if (rdoData.branch_material === "Aço") {
    doc
      .rect(400,170.5, 10, 5) // x, y, largura, altura
      .fill("black");
    }

     if (rdoData.branch_material === "PE80") {
    doc
      .rect(400,179, 10, 5) // x, y, largura, altura
      .fill("black");
    }

     if (rdoData.branch_material === "PE100") {
    doc
      .rect(400,186, 10, 5) // x, y, largura, altura
      .fill("black");
    }

     if (rdoData.branch_material === "outro") {
    doc
      .rect(400,193, 10, 5) // x, y, largura, altura
      .fill("black");
    }

    //Diametro do ramal
       if (rdoData.pipe_branch_diameter === "20mm") {
    doc
      .rect(495,170, 10, 5) // x, y, largura, altura
      .fill("black");
    }
           if (rdoData.pipe_branch_diameter === "32mm") {
    doc
      .rect(495,182.5, 10, 5) // x, y, largura, altura
      .fill("black");
    }
           if (rdoData.pipe_branch_diameter === "40mm") {
    doc
      .rect(495,196, 10, 5) // x, y, largura, altura
      .fill("black");
    }
           if (rdoData.pipe_branch_diameter === "63mm") {
    doc
      .rect(538,170, 10, 5) // x, y, largura, altura
      .fill("black");
    }
           if (rdoData.pipe_branch_diameter === "90mm") {
    doc
      .rect(538,182.5, 10, 5) // x, y, largura, altura
      .fill("black");
    }
           if (rdoData.pipe_branch_diameter === "outro") {
    doc
      .rect(538,196, 10, 5) // x, y, largura, altura
      .fill("black");
    }
    //Ramal Cortado
     if (rdoData.cut_branch === "principal") {
    doc
      .rect(53,230, 13, 5) // x, y, largura, altura
      .fill("black");
    }
      if (rdoData.cut_branch === "adjacenteDireita") {
    doc
      .rect(53,244.6, 13, 5) // x, y, largura, altura
      .fill("black");
    }
      if (rdoData.cut_branch === "adjacenteEsquerda") {
    doc
      .rect(53,259, 13, 5) // x, y, largura, altura
      .fill("black");
    }
    //Tipo de Ramal
       if (rdoData.branch_type === "mesmoLado") {
    doc
      .rect(135,232, 13, 5) // x, y, largura, altura
      .fill("black");
    }   if (rdoData.branch_type === "ladoOposto") {
    doc
      .rect(135,258.5, 13, 5) // x, y, largura, altura
      .fill("black");
    }

    //posição do Ramal Esquina direita   Esquina esquerda   Entre lotes
    if (rdoData.branch_position === "Entre lotes") {
    doc
      .rect(206,230, 12, 5) // x, y, largura, altura
      .fill("black");
    }
    if (rdoData.branch_position === "Esquina direita") {
    doc
      .rect(206,244.5, 12, 5) // x, y, largura, altura
      .fill("black");
    }
    if (rdoData.branch_position === "Esquina esquerda") {
    doc
      .rect(206,258.5, 12, 5) // x, y, largura, altura
      .fill("black");
    }

    //Local do Corte geral geralExtremidadeRemanescente preVgb posVgb
      if (rdoData.cut_location === "geral") {
    doc
      .rect(286,223.5, 12, 5) // x, y, largura, altura
      .fill("black");
    }
     if (rdoData.cut_location === "geralExtremidadeRemanescente") {
    doc
      .rect(286,238, 12, 5) // x, y, largura, altura
      .fill("black");
    }
     if (rdoData.cut_location === "preVgb") {
    doc
      .rect(286,252, 12, 5) // x, y, largura, altura
      .fill("black");
    }
     if (rdoData.cut_location === "posVgb") {
    doc
      .rect(286,266.5, 12, 5) // x, y, largura, altura
      .fill("black");
    }

    //Tipo de Capeamento flange capRosca  capSoldadoAco capSoldadoPE
    if (rdoData.capping_type === "flange") {
    doc
      .rect(361,223.5, 12, 5) // x, y, largura, altura
      .fill("black");
    }
      if (rdoData.capping_type === "capRosca") {
    doc
      .rect(361,238, 12, 5) // x, y, largura, altura
      .fill("black");
    }
      if (rdoData.capping_type === "capSoldadoAco") {
    doc
      .rect(361,252, 12, 5) // x, y, largura, altura
      .fill("black");
    }
      if (rdoData.capping_type === "capSoldadoPE") {
    doc
      .rect(361,266.5, 12, 5) // x, y, largura, altura
      .fill("black");
    }

    //Proteção mecanica
    if (rdoData.mechanical_protection === true) {
    doc
      .rect(439,232, 12, 5) // x, y, largura, altura
      .fill("black");
    }
        if (rdoData.mechanical_protection === false) {
    doc
      .rect(439,258, 12, 5) // x, y, largura, altura
      .fill("black");
    }
    //Tachão
       if (rdoData.round_tachao === true) {
    doc
      .rect(516,232, 12, 5) // x, y, largura, altura
      .fill("black");
    }
    if (rdoData.round_tachao === false) {
        doc        
        .rect(516,258, 12, 5) // x, y, largura, altura
        .fill("black");
    }  
    // 🌐 Esquerda - Corte geral - OK
    if (rdoData.street_data.name === "geral_esquerda") {
        // === Carregar imagem de fundo 2 (metade inferior) ===
        const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_adjacente esquerta_geral.png");
        doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
            width: doc.page.width /1.04,  
            height: doc.page.height / 2.095
        });  
        
        function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
        const positions = {
        left_street: { x: 147, y: 730, rotate: -90  },
        center_street: { x: 280, y: 690 },
        right_street: { x: 445, y: 730, rotate: -90 },
        left_point_a: { x: 204, y: 638 },
        right_point_a: { x: 327, y: 638 },
        B_point: { x: 166, y: 610, rotate: -90 },
        pg_number: { x: 355, y: 630},
        street_width: { x: 395, y: 680,rotate: -90  },
        branch_cut: { x: 50, y: 140 },
        cut_location: { x: 200, y: 140 },
        left_number: { x: 245, y: 516},
        right_number: { x: 365, y: 516},
        PVGB: { x: 50, y: 200 },
        PC_POS_VGB: { x: 200, y: 200 },
        VGB_distance: { x: 350, y: 200 },
        PC_PRE_VGB: { x: 50, y: 230 },
        CP_PRE_VGB_distance: { x: 200, y: 230 },
        CPOSVGB_distance: { x: 350, y: 230 }
        
        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_adjacente esquerda_geral.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
    
        
    }      

//Principal Geral -OK
if (rdoData.street_data.name === "principal_geral") {
     // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplicada_princial_geral.png"); 
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });  
     function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
        const positions = {
             left_number: { x: 200, y: 522},
              center_number: { x: 292, y: 449 },
              right_number:  { x: 390, y: 522 },
              street_width: { x: 396, y: 680,rotate: -90  },
              left_street: { x: 150, y: 730, rotate: -90  },
              center_street: { x: 280, y: 690 },
              right_street: { x: 445, y: 730, rotate: -90 },
              left_point_a: { x: 210, y: 638 },
              right_point_a: { x: 327, y: 638 },
              B_point: { x: 166, y: 610, rotate: -90 },
              pg_number: { x: 385, y: 630},
             };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_principal_geral.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}    

 // 🌐 Principal pos vgb - OK
if (rdoData.street_data.name === "principal_posVgb") {
     // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_principal_pos_vgb_entre_lotes.png"); 
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });  
     function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
        const positions = {
            left_point_a: { x: 204, y: 642 },
            right_point_a: { x: 327, y: 642 },
            B_point: { x: 170, y: 613, rotate: -90 },
            pg_number: { x: 385, y: 635},
            PC_POS_VGB: { x: 370, y: 560 },
            PVGB: { x: 345, y: 578 },
            left_number: { x: 200, y: 522},
            center_number: { x: 292, y: 449 },
            right_number:  { x: 390, y: 522 },
            street_width: { x: 399, y: 680,rotate: -90  },
            left_street: { x: 147, y: 730, rotate: -90  },
            center_street: { x: 280, y: 690 },
            right_street: { x: 445, y: 730, rotate: -90 },
            VGB_distance: { x: 253, y: 566,rotate: -90  },
            CPOSVGB_distance: { x: 280, y: 555,rotate: -90  },
               
        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_principal_pos_vgb.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}    

 // 🌐 Principal pre vgb -OK
if (rdoData.street_data.name === "principal_preVgb") {
     // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_principal_pre_vbg_entre_lotes.png"); 
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });  
     function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
        const positions = {
            left_point_a: { x: 214, y: 642 },
            right_point_a: { x: 327, y: 642 },
            B_point: { x: 176, y: 615, rotate: -90 },
            pg_number: { x: 380, y: 633},
            PC_PRE_VGB: { x: 370, y: 600 },
            left_number: { x: 200, y: 522},
            center_number: { x: 292, y: 449 },
            right_number:  { x: 390, y: 522 },
            street_width: { x: 397, y: 680,rotate: -90  },
            left_street: { x: 157, y: 730, rotate: -90  },
            center_street: { x: 280, y: 690 },
            right_street: { x: 445, y: 730, rotate: -90 },
            CP_PRE_VGB_distance: { x: 224, y: 590 ,rotate: -90  },
        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_principal_pre_vgb.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}    

  // 🌐 Principal geral com extremidade remanescente -OK
if (rdoData.street_data.name === "principal_geralComExtremidadeRemanescente") {
     // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_principal_geral_com_extremidade_remanescente.png"); 
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });  
     function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
        const positions = {
          left_point_a: { x: 204, y: 638 },
          right_point_a: { x: 327, y: 638 },
          B_point: { x: 168, y: 605, rotate: -90 },
          pg_number: { x: 380, y: 630},
          PC_PRE_VGB: { x: 345, y: 615 },
          left_number: { x: 195, y: 522},
            center_number: { x: 292, y: 449 },
            right_number:  { x: 390, y: 522 },
          street_width: { x: 397, y: 680,rotate: -90  },
          left_street: { x: 147, y: 730, rotate: -90  },
          center_street: { x: 280, y: 690 },
          right_street: { x: 445, y: 730, rotate: -90 },
          CPC_predial: { x: 195, y: 605, rotate: -90 },
    
        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_principal_geral com extremidade remanescente.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}    

  // 🌐 Esquerda - Pré VGB (2 cortes) - OK - VERIFICAR PRESÃO NÃO ESTA MARCANDO
if (rdoData.street_data.name === "preVgb_esquerda_doisCortes") {
     // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_adjacente esquerda_pre_vgb_dois corte.png"); 
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });  
     function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
        const positions = {
          left_point_a: { x: 208, y: 629 },
          right_point_a: { x: 330, y: 629 },
          B_point: { x: 172, y: 605, rotate: -90 },
          pg_number: { x: 358, y: 620},
          PC_PRE_VGB: { x: 369, y: 576 },
          left_number: { x: 241, y: 510},
          right_number: { x: 361, y: 510},
          street_width: { x: 400, y: 673,rotate: -90  },
          left_street: { x: 127, y: 730, rotate: -90  },
          center_street: { x: 280, y: 730 },
          right_street: { x: 465, y: 730, rotate: -90 },
          CP_PRE_VGB_distance: { x: 194, y: 570,rotate: -90 },
   
        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_adjacente esquerda_pre_vgb_dois cortes.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}    

  //🌐 Esquerda - Pré VGB (1 corte) -OK
if (rdoData.street_data.name === "preVgb_esquerda_ramalAdjacente") { // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_adjacente_esquerda_ramal_adjacente.png");
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });
 function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
const positions = {
  left_number: { x: 245, y: 511},
  right_number: { x: 365, y: 511},
  street_width: { x: 402, y: 673,rotate: -90  },
  left_street: { x: 135, y: 730, rotate: -90  },
  center_street: { x: 280, y: 730 },
  right_street: { x: 451, y: 730, rotate: -90 },
  left_point_a: { x: 208, y: 630 },
  right_point_a: { x: 331, y: 630 },
  B_point: { x: 173, y: 605, rotate: -90 },
  pg_number: { x: 359, y: 621},
  PCRA: { x: 317, y: 548, rotate: -90 },
  point_q: { x: 393, y: 567, rotate: -90 },
  point_p: { x: 338, y: 590},

        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_adjacente esquerda_ramal adjacente.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}  
    

  // 🌐 Esquerda - Pós VGB (1 corte) -OK
if (rdoData.street_data.name === "posVgb_esquerda_umCorte") { // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_adjacente_esquerda_pos_vgb_um corte.png");
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });
 function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
const positions = {
  left_number: { x: 245, y: 516},
  right_number: { x: 365, y: 516},
  street_width: { x: 400, y: 679,rotate: -90  },
  left_street: { x: 150, y: 730, rotate: -90  },
  center_street: { x: 280, y: 690 },
  right_street: { x: 447, y: 730, rotate: -90 },
  left_point_a: { x: 208, y: 638 },
  right_point_a: { x: 358, y: 635 },
  B_point: { x: 170, y: 610, rotate: -90 },
  pg_number: { x: 388, y: 630},
  point_q: { x: 307, y: 550, rotate: -90 },
  point_r: { x: 315, y: 570, rotate: -90 },
  point_g: { x: 385, y: 555 , rotate: -90 },
  point_s: { x: 398, y: 565 , rotate: -90 },
  point_h: { x: 353, y: 597 },
  PCRA: { x: 50, y: 230 },
  PVGB: { x: 200, y: 230 },


        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_adjacente esquerda_pos_vgb_um corte.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}  

  //  🌐 Esquerda - Pós VGB (2 cortes)  - G DA DIREITA ESTÁ VINDO NULO
if (rdoData.street_data.name === "posVgb_esquerda_doisCortes") { // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_adjacente_esquerda_pos_vgb_dois cortes.png");
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });
 function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
     
        const positions = {
  left_number: { x: 245, y: 516},
  right_number: { x: 365, y: 516},
  street_width: { x: 402, y: 680,rotate: -90  },
  left_street: { x: 137, y: 730, rotate: -90  },
  center_street: { x: 280, y: 690 },
  right_street: { x: 460, y: 730, rotate: -90 },
  left_point_a: { x: 204, y: 638 },
  right_point_a: { x: 355, y: 638 },
  B_point: { x: 172, y: 610, rotate: -90 },
  pg_number: { x: 385, y: 630},
  point_q: { x: 309, y: 550 , rotate: -90 },
  point_r: { x: 315, y: 572 , rotate: -90 },
  point_g_left: { x: 203, y: 555 , rotate: -90 },
  point_g_right: { x: 383, y: 555 , rotate: -90 },
  point_s: { x: 398, y: 565 , rotate: -90 }, 
  point_h: { x: 353, y: 597 },
  PCRA: { x: 50, y: 230 },
  PVGB_left: { x: 200, y: 230 },
    PVGB_left: { x: 206, y: 230 },
      PVGB_right: { x: 209, y: 230 },
        PCPOSVGB_left: { x: 232, y: 538 },
point_o: { x: 218, y: 548 , rotate: -90 },
left_distance: { x: 218, y: 548 , rotate: -90 },

        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_adjacente esquerda_pos_vgb_dois cortes.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}  

  // 🌐 Direita - Pós VGB (1 corte)  
if (rdoData.street_data.name === "posVgb_direita_umCorte") { // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_adjacente_direita_pos_vgb_um corte.png");
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });
 function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
      const positions = {
        left_number: { x: 245, y: 516},
        right_number: { x: 365, y: 516},
        street_width: { x: 395, y: 680,rotate: -90  },
        left_street: { x: 147, y: 730, rotate: -90  },
        center_street: { x: 280, y: 690 },
        right_street: { x: 445, y: 730, rotate: -90 },
        left_point_a: { x: 204, y: 638 },
        right_point_a: { x: 327, y: 638 },
        B_point: { x: 166, y: 610, rotate: -90 },
        pg_number: { x: 355, y: 630},
        point_q: { x: 200, y: 230 },
        point_r: { x: 210, y: 230 },
        point_g: { x: 220, y: 230 },
        point_s: { x: 230, y: 230 }, 
        point_h: { x: 204, y: 230 },
        PCRA: { x: 50, y: 230 },
        PVGB: { x: 200, y: 230 },
           
        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_adjacente direita_pos_vgb_um corte.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}  

 // 🌐 Direita - Pós VGB (2 cortes)   
if (rdoData.street_data.name === "posVgb_direita_doisCortes") {
     // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_adjacente_direita_pos_vgb_dois cortes.png"); 
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });  
     function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
      const positions = {
        left_number: { x: 245, y: 516},
        right_number: { x: 365, y: 516},
        street_width: { x: 395, y: 680,rotate: -90  },
        left_street: { x: 147, y: 730, rotate: -90  },
        center_street: { x: 280, y: 690 },
        right_street: { x: 445, y: 730, rotate: -90 },
        left_point_a: { x: 204, y: 638 },
        right_point_a: { x: 327, y: 638 },
        B_point: { x: 166, y: 610, rotate: -90 },
        pg_number: { x: 355, y: 630},
        point_o: { x: 200, y: 230 },
        point_r: { x: 210, y: 230 },
        point_g_left: { x: 220, y: 230 },
        point_g_right: { x: 220, y: 230 },
        point_s: { x: 230, y: 230 }, 
        point_h: { x: 204, y: 230 },
        PCPOSVGB_right: { x: 50, y: 230 },
        PVGB_left: { x: 200, y: 230 },
             PVGB_right: { x: 50, y: 230 },
        PCRA_left: { x: 200, y: 230 },
         point_q: { x: 200, y: 230 },
          
        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_adjacente_direita_pos_vgb_dois_cortes.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}    

  // 🌐 Direita - Corte geral
if (rdoData.street_data.name === "geral_direita") {
     // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_adjacente_direita_corte_geral.png"); 
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    }); 
     function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
      const positions = {
        left_number: { x: 245, y: 516},
        right_number: { x: 365, y: 516},
        street_width: { x: 395, y: 680,rotate: -90  },
        left_street: { x: 147, y: 730, rotate: -90  },
        center_street: { x: 280, y: 690 },
        right_street: { x: 445, y: 730, rotate: -90 },
        left_point_a: { x: 204, y: 638 },
        right_point_a: { x: 327, y: 638 },
        B_point: { x: 166, y: 610, rotate: -90 },
        pg_number: { x: 355, y: 630},
       
        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/ismoetrico_adjacente direita_corte geral.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05}); 
}    

  // 🌐 Direita - Ramal adjacente
if (rdoData.street_data.name === "preVgb_direita_ramalAdjacente") {
     // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_adjacente_direira_ramal_adjacente.png"); 
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });  
     function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
       const positions = {
        left_number: { x: 245, y: 516},
        right_number: { x: 365, y: 516},
        street_width: { x: 395, y: 680,rotate: -90  },
        left_street: { x: 147, y: 730, rotate: -90  },
        center_street: { x: 280, y: 690 },
        right_street: { x: 445, y: 730, rotate: -90 },
        left_point_a: { x: 204, y: 638 },
        right_point_a: { x: 327, y: 638 },
        B_point: { x: 166, y: 610, rotate: -90 },
        pg_number: { x: 355, y: 630},
        PCRA: { x: 200, y: 230 },
        point_q: { x: 200, y: 230 },
        point_p: { x: 200, y: 230 },
     
        
        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_adjacente direita_ramal adjacente.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}    

  //🌐 Esquerda - Pré VGB (2 corte)
if (rdoData.street_data.name === "preVgb_direita_doisCortes") { // === Carregar imagem de fundo 2 (metade inferior) ===
    const bgPath_two = path.join(__dirname, "../assets/croqui/planta_simplificada_adjacente esquerda_pre_vgb_dois corte.png");
    doc.image(bgPath_two, 15, 363 ,{ // 👈 começa depois da primeira
      width: doc.page.width /1.04,  
      height: doc.page.height / 2.095
    });
 function renderCroquiMapped(doc, streetData) {
        if (!streetData || !streetData.data) return; // se não existir, sai
        
        const d = streetData.data;
        
  const positions = {
        left_number: { x: 245, y: 516},
        right_number: { x: 365, y: 516},
        street_width: { x: 395, y: 680,rotate: -90  },
        left_street: { x: 147, y: 730, rotate: -90  },
        center_street: { x: 280, y: 690 },
        right_street: { x: 445, y: 730, rotate: -90 },
        left_point_a: { x: 204, y: 638 },
        right_point_a: { x: 327, y: 638 },
        B_point: { x: 166, y: 610, rotate: -90 },
        pg_number: { x: 355, y: 630},
        PCRA: { x: 200, y: 230 },
        point_n: { x: 200, y: 230 },
        
        };
        Object.entries(positions).forEach(([key, pos]) => {
        const value = d[key];
        if (value === null || value === undefined || value === "") return;
        
        if (pos.rotate) {
          doc.save();                      // salva estado
          doc.rotate(pos.rotate, { origin: [pos.x, pos.y] });
          doc.text(`${value}`, pos.x, pos.y);
          doc.restore();                   // restaura estado
        } else {
          doc.text(`${value}`, pos.x, pos.y);
        }
        });
        }
        
        //
        // Chamada
        renderCroquiMapped(doc, rdoData.street_data);
        
        
        const bgPath_three = path.join(__dirname, "../assets/sign.png");
        doc.image(bgPath_three, 0, 760 ,{ // 👈 começa depois da primeira
          width: doc.page.width,
        
        });
        
        
        doc.addPage();
        const page_two = path.join(__dirname, "../assets/isometrico/isometrico_adjacente esquerda_pre_vgb_dois cortes.png");
        doc.image(page_two, 30, 30, {    width: doc.page.width /1.1,
          height: doc.page.height / 3.05});
}  


      const page_three = path.join(__dirname, "../assets/last_part.png");
doc.image(page_three , 30, 330, {    width: doc.page.width /1.1,
      height: doc.page.height / 1.73});

if (rdoData.components && rdoData.components.length > 0) {
  rdoData.components.forEach((comp, index) => {
    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `${comp.manufacturer || "-"}`,
        233, // posição X (coluna)
        346.5 + (index * 20) // posição Y (linha ajustada p/ não sobrepor)
      );
  });
   rdoData.components.forEach((comp, index) => {
    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `${comp.manufacturer || "-"}`,
        282, // posição X (coluna)
        401 + (index * 20) // posição Y (linha ajustada p/ não sobrepor)
      );
  });
   rdoData.components.forEach((comp, index) => {
    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `${comp.batch|| "-"}`,
        423, // posição X (coluna)
        401 + (index * 20) // posição Y (linha ajustada p/ não sobrepor)
      );
  });
   rdoData.components.forEach((comp, index) => {
    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `${comp.name || "-"}`,
        60, // posição X (coluna)
        401 + (index * 20) // posição Y (linha ajustada p/ não sobrepor)
      );
  });
   rdoData.components.forEach((comp, index) => {
    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `${comp.size || "-"}`,
        208, // posição X (coluna)
        401 + (index * 20) // posição Y (linha ajustada p/ não sobrepor)
      );
  });
  
}

if (rdoData.welds && rdoData.welds.length > 0) {
  rdoData.welds.forEach((weld, index) => {
    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `${weld.component || "-"}`,
        130, // posição X (coluna)
        522 + (index * 20) // posição Y (linha ajustada p/ não sobrepor)
      );
  });
   rdoData.welds.forEach((weld, index) => {
    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `${weld.weld_number || "-"}`,
        218, // posição X (coluna)
        522 + (index * 20) // posição Y (linha ajustada p/ não sobrepor)
      );
  });

    rdoData.welds.forEach((weld, index) => {
    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `${weld.cooling_time || "-"}`,
        360, // posição X (coluna)
        522 + (index * 20) // posição Y (linha ajustada p/ não sobrepor)
      );
  });
rdoData.welds.forEach((weld, index) => {
  const aprovado = weld.approved ? "Sim" : "Não";

  doc
    .fontSize(12)
    .fillColor("black")
    .text(
      aprovado,
      475, // posição X (coluna)
      522 + (index * 20) // posição Y (linha ajustada p/ não sobrepor)
    );
});

if (rdoData.trenches && rdoData.trenches.length > 0) {
  doc.addPage(); // nova página para trincheiras

  // === Adicionar logo no topo ===
  const logoPath = path.join(__dirname, "../assets/logo.png");
  try {
    
    doc.image(logoPath, 20, 20,{ width: doc.page.width/ 1.06,
  height: doc.page.height / 20}); // x=50, y=20, largura=100
  } catch (err) {
    console.error("Erro ao carregar logo:", err);
  }
    const title = "Dados da Vala";
const x = 50;
const y = 70;

// Negrito e tamanho maior
doc
  .fontSize(16)
  .fillColor("#000000")
  .font("Helvetica-Bold") // usar fonte bold se disponível
  .text(title, x, y);

// Sublinhar
const textWidth = doc.widthOfString(title);
const textHeight = doc.currentLineHeight();
doc
  .moveTo(x, y + textHeight + 2) // linha um pouco abaixo
  .lineTo(x + textWidth, y + textHeight + 2)
  .strokeColor("#000000")
  .lineWidth(1)
  .stroke();

  rdoData.trenches.forEach((trench, index) => {
  const baseY = 110 + (index * 90);

  // Caixa para cada trincheira
  doc
    .rect(45, baseY - 5, 500, 80)
    .stroke("#888888"); // cor cinza para borda

  // Dados dentro da caixa
  doc
    .fontSize(12)
    .fillColor("#000000")
    .text(`Comprimento: ${trench.length || "-"}`, 50, baseY)
    .text(`Largura: ${trench.width || "-"}`, 50, baseY + 18)
    .text(`Profundidade: ${trench.depth || "-"}`, 50, baseY + 36)
    .text(`Tipo de Piso: ${trench.floor_type || "-"}`, 50, baseY + 54);
});



// Renderizar fotos em grid profissional
async function renderPhotosProfessional(doc, rdoData) {
  if (!rdoData.photos || rdoData.photos.length === 0) return;

  const colX = [50, 300]; // duas colunas
  let xIndex = 0;
  let y = doc.y + 30; // começa abaixo do último conteúdo
  const photoWidth = 220;
  const photoHeight = 120;
  const rowGap = 50; // espaço entre linhas de fotos
  const borderPadding = 5;

  const photoLabels = {
    sidewalk_before: "Calçada Antes",
    sketch: "Croqui",
    front_house: "Frente da Casa",
    street_sign: "Placa de Rua",
    mechanical_protection: "Proteção Mecânica",
    provisional: "Provisório",
    cut_branch: "Ramal Cortado",
    exposed_branch: "Ramal Exposto",
    tachao: "Tachão"
  };

  for (let photo of rdoData.photos) {
    for (let key of Object.keys(photoLabels)) {
      const url = photo[key];
      if (!url) continue;

      // Quebra de página se a foto ultrapassar a altura da página
      if (y + photoHeight + 40 > doc.page.height - 60) {
        doc.addPage();
        y = 50;
      }

      try {
        const res = await fetch(url);
        const buffer = await res.arrayBuffer();
        const imageBuffer = Buffer.from(buffer);

        // Desenhar borda e sombra leve
        doc.save();
        doc.rect(colX[xIndex] - borderPadding, y - borderPadding, photoWidth + 2*borderPadding, photoHeight + 2*borderPadding)
           .lineWidth(0.5)
           .strokeColor("#333333")
           .stroke();
        doc.restore();

        doc.image(imageBuffer, colX[xIndex], y, { width: photoWidth, height: photoHeight });

        // Legenda
        doc.fontSize(10)
           .fillColor("black")
           .text(photoLabels[key], colX[xIndex], y + photoHeight + 5);

      } catch (err) {
        console.error("Erro ao carregar imagem:", url, err);
        doc.fontSize(10)
           .fillColor("red")
           .text(`Erro ao carregar: ${photoLabels[key]}`, colX[xIndex], y + photoHeight / 2);
      }

      xIndex++;
      if (xIndex >= colX.length) {
        xIndex = 0;
        y += photoHeight + rowGap + 15; // próxima linha
      }
    }
  }

  // Linha divisória central do grid
  doc.save();
  doc.moveTo(doc.page.width / 2, doc.y - 50)
     .lineTo(doc.page.width / 2, y - 20)
     .lineWidth(1)
     .strokeColor("#CCCCCC")
     .stroke();
  doc.restore();

}

// No controller, chame assim antes de doc.end():
await renderPhotosProfessional(doc, rdoData);
}}
doc.end();
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    res.status(500).json({ message: "Erro ao gerar PDF" });
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
    create_rdo_controller, rdo_not_executed, generate_rdo_pdf_controller, get_rdo_by_project_controller
};


export default rdo_controller; // ✅ Exporta controller como default



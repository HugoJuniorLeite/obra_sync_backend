import prisma from "../database/prismaClient.js";

// async function create_rdo_repository(data) {
    
//     try {

// return prisma.$transaction(async (tx) => {
//     const daily_report = await tx.daily_report.create({
//         data: {
//             pipe_branch_diameter: data.pipe_branch_diameter,
//             pipe_network_diameter: data.pipe_network_diameter,
//             signal_tape: data.signal_tape,
//             round_tachao: data.round_tachao,
//             capping_type: data.capping_type,
//             branch_type: data.branch_type,
//             cut_location: data.cut_location,
//             branch_material: data.branch_material,
//             network_material: data.network_material,
//             branch_position: data.branch_position,
//             network_pressure: data.network_pressure || null,
//             mechanical_protection: data.mechanical_protection,
//             cut_branch: data.cut_branch,
            
            
//             bill: { connect: { id: Number(data.bill_id) } },
            
//             components: {
//                 create: (data.components || []).map((c) => ({
//                         name: c.componente,
//                         size: c.de,
//                         manufacturer: c.fabricante,
//                         batch: c.lote,
//                     })),
//                 },
                
//       photos: data.photos
//     ? {
//         create: {
//             sidewalk_before: data.photos.sidewalk_before,
//             sketch: data.photos.sketch,
//             front_house: data.photos.front_house,
//             street_sign: data.photos.street_sign,
//             mechanical_protection: data.photos.mechanical_protection,
//             provisional: data.photos.provisional,
//             cut_branch: data.photos.cut_branch,
//             exposed_branch: data.photos.exposed_branch,
//         },
//     }
//     : undefined,
                        
//                         welds: {
//                             create: (data.welds || []).map((s) => ({
//                         weld_number: s.numeroSolda,
//                         component: s.componente,
//                         approved: s.aprovado === "Sim",
//                         cooling_time: s.tempoResfriamento,
//                     })),
//                 },
//                 // street_data: {
//                 //    street_data: data.street_data ? { create: data.street_data } : undefined,
//                 // },
//                    street_data: street_data
//           ? {
//               create: {
//                 name: street_data.name,
//                 data: street_data // salva os dados como JSON
//               }
//             }
//           : undefined ,
//                 trenches: {
//                     create: (data.trenches || []).map((v) => ({
//                         length: parseInt(v.comprimento),
//                         width: parseInt(v.largura),
//                         depth: parseInt(v.profundidade),
//                         floor_type: v.tipoPiso,
//                     })),
//                 },
//             },
//             include: {
//                 components: true,
//                 photos: true,
//                 welds: true,
//                 trenches: true,
//                 bill: true,
//                 street_data: true
//             },
//         });
        
        
//         await tx.bill.update({
//             where: { id: Number(data.bill_id) },
//             data: { status: data.resultado },
//         });
        
//         return daily_report;
//     });
// } catch (error) {
    
// }
// }
async function create_rdo_repository(data) {
    console.log(data, "repository");
    
  try {
    return prisma.$transaction(async (tx) => {
      const daily_report = await tx.daily_report.create({
        data: {
          pipe_branch_diameter: data.pipe_branch_diameter,
          pipe_network_diameter: data.pipe_network_diameter,
          signal_tape: data.signal_tape,
          round_tachao: data.round_tachao,
          capping_type: data.capping_type,
          branch_type: data.branch_type,
          cut_location: data.cut_location,
          branch_material: data.branch_material,
          network_material: data.network_material,
          branch_position: data.branch_position,
          network_pressure: data.network_pressure || null,
          mechanical_protection: data.mechanical_protection,
          cut_branch: data.cut_branch,
          flow_valve_type: data.flow_valve_type === "true" ? true : data.flow_valve_type === "false" ? false : null,

          bill: { connect: { id: Number(data.bill_id) } },

          components: {
            create: (data.components || []).map((c) => ({
              name: c.componente,
              size: c.de,
              manufacturer: c.fabricante,
              batch: c.lote,
            })),
          },

          photos: data.photos
            ? {
                create: {
                  sidewalk_before: data.photos.sidewalk_before,
                  sketch: data.photos.sketch,
                  front_house: data.photos.front_house,
                  street_sign: data.photos.street_sign,
                  mechanical_protection: data.photos.mechanical_protection,
                  provisional: data.photos.provisional,
                  cut_branch: data.photos.cut_branch,
                  exposed_branch: data.photos.exposed_branch,
                },
              }
            : undefined,

          welds: {
            create: (data.welds || []).map((s) => ({
              weld_number: s.numeroSolda,
              component: s.componente,
              approved: s.aprovado === "Sim",
              cooling_time: s.tempoResfriamento,
            })),
          },

          // 🔹 sempre cria street_data junto
  street_data: {
  create: {
    name: data.street_data?.name || "default",
    data: data.street_data || {}, // aqui pega todo o objeto enviado pelo frontend
  },
},

          trenches: {
            create: (data.trenches || []).map((v) => ({
              length: parseInt(v.comprimento),
              width: parseInt(v.largura),
              depth: parseInt(v.profundidade),
              floor_type: v.tipoPiso,
            })),
          },
        },
        include: {
          components: true,
          photos: true,
          welds: true,
          trenches: true,
          bill: true,
          street_data: true,
        },
      });

      await tx.bill.update({
        where: { id: Number(data.bill_id) },
        data: { status: data.resultado,
           service_completed_at: new Date()
         },
      });

      return daily_report;
    });
  } catch (error) {
    console.error("❌ Erro no create_rdo_repository:", error);
    throw error;
  }
}
async function rdo_not_executed(bill_id, data) {
  try {
    return prisma.bill.update({
        where: { id: Number(bill_id) },
        data: { status: "nao_executada",
            ...(data.note && { note: data.note }),
            ...(data.detail && { detail: data.detail })
         },
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

async function get_rdo_by_bill_id(bill_id) {
    return prisma.daily_report.findFirst({
        where: {
            bill_id: Number(bill_id),
        },
        include: {
            components: true,
            photos: true,
            trenches: true,
            welds: true,
            street_data : true,
             bill: {   // include do modelo relacionado
      include: {
        consultant: true,
        customer: true,
        customer_address: true,
        extension_address: true,

      }
    }

        },
    });
}

async function get_bill_by_project(project_id) {
    try {
        return prisma.bill.findMany({
            where: {project_id: Number(project_id)}
        })
    } catch (error) {
        throw new Error(error.message);
        
    }
}

const rdo_repository = {
    create_rdo_repository, rdo_not_executed, get_rdo_by_bill_id,get_bill_by_project
};

export default rdo_repository;

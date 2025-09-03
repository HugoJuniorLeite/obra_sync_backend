// import prisma from "../database/prismaClient.js";

// export async function create_rdo_repository(data) {
//   return prisma.$transaction(async (tx) => {
//     // 1️⃣ Cria o daily_report
//     const dailyReport = await tx.daily_report.create({
//       data: {
//         pipe_branch_diameter: data.diametroRamal,
//         pipe_network_diameter: data.diametroRede,
//         signal_tape: data.faixaSinalizacao === "true",
//         cut_location: data.localCorte,
//         branch_material: data.materialRamal,
//         network_material: data.materialRede,
//         branch_position: data.posicaoRamal,
//         network_pressure: data.pressaoRede || null,
//         mechanical_protection: data.protecaoMecanica === "true",
//         cut_branch: data.ramalCortado,
//         round_tachao: data.tachaoRedondo === "true",
//         capping_type: data.tipoCapeamento,
//         branch_type: data.tipoRamal,

//         bill: { connect: { id: data.billId } },

//         components: {
//           create: (data.componentes || []).map((c) => ({
//             name: c.componente,
//             size: c.de,
//             manufacturer: c.fabricante,
//             batch: c.lote,
//           })),
//         },

//         photos: data.fotos
//           ? {
//               create: {
//                 sidewalk_before: data.fotos.fotoCalcadaAntes,
//                 sketch: data.fotos.fotoCroqui,
//                 front_house: data.fotos.fotoFrenteImovel,
//                 street_sign: data.fotos.fotoPlacaRua,
//                 mechanical_protection: data.fotos.fotoProtecaoMecanica,
//                 provisional: data.fotos.fotoProvisorio,
//                 cut_branch: data.fotos.fotoRamalCortado,
//                 exposed_branch: data.fotos.fotoRamalExposto,
//               },
//             }
//           : undefined,

//         welds: {
//           create: (data.soldas || []).map((s) => ({
//             weld_number: s.numeroSolda,
//             component: s.componente,
//             approved: s.aprovado === "Sim",
//             cooling_time: s.tempoResfriamento,
//           })),
//         },

//         trenches: {
//           create: (data.valas || []).map((v) => ({
//             length: parseInt(v.comprimento),
//             width: parseInt(v.largura),
//             depth: parseInt(v.profundidade),
//             floor_type: v.tipoPiso,
//           })),
//         },
//       },
//       include: {
//         components: true,
//         photos: true,
//         welds: true,
//         trenches: true,
//         bill: true,
//       },
//     });

//     // 2️⃣ Atualiza o status da bill para 'executada'
//    await tx.bill.update({
//       where: { id: data.billId },
//       data: { status: data.resultado } // <-- pega o valor enviado no front
//     });

//     // 3️⃣ Retorna o daily_report criado
//     return dailyReport;
//   });
// }

// const rdo_repository = {
//     create_rdo_repository
// }
// //Groot@2025
// export default rdo_repository;

import prisma from "../database/prismaClient.js";

async function create_rdo_repository(data) {
    return prisma.$transaction(async (tx) => {
        const daily_report = await tx.daily_report.create({
            data: {
                pipe_branch_diameter: data.pipe_branch_diameter,
                pipe_network_diameter: data.pipe_network_diameter,
                signal_tape: data.signal_tape,
                cut_location: data.cut_location,
                branch_material: data.branch_material,
                network_material: data.network_material,
                branch_position: data.branch_position,
                network_pressure: data.network_pressure || null,
                mechanical_protection: data.mechanical_protection,
                cut_branch: data.cut_branch,
                round_tachao: data.round_tachao,
                capping_type: data.capping_type,
                branch_type: data.branch_type,
               

                bill: { connect: { id: data.bill_id } },

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
                              sidewalk_before: data.photos.fotoCalcadaAntes,
                              sketch: data.photos.fotoCroqui,
                              front_house: data.photos.fotoFrenteImovel,
                              street_sign: data.photos.fotoPlacaRua,
                              mechanical_protection: data.photos.fotoProtecaoMecanica,
                              provisional: data.photos.fotoProvisorio,
                              cut_branch: data.photos.fotoRamalCortado,
                              exposed_branch: data.photos.fotoRamalExposto,
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
            },
        });

        // Atualiza o status da Bill
        await tx.bill.update({
            where: { id: data.bill_id },
            data: { status: data.resultado },
        });

        return daily_report;
    });
}

const rdo_repository = {
    create_rdo_repository,
};

export default rdo_repository;

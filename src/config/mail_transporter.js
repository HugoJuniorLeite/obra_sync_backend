import nodemailer from "nodemailer";

async function sendEmail(email,token) {
    
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
        },
    }); 
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Seu código de acesso",
        text: `Seu código de acesso é: ${token}. Bem-vindo ao Project Manager!

Este token oferece acesso completo ao sistema, permitindo a gestão integral de seus projetos, incluindo o cadastro de colaboradores e a configuração granular de permissões conforme os cargos e funções. Nossa plataforma foi desenvolvida para proporcionar controle seguro e eficiente, assegurando que cada usuário tenha acesso apropriado às funcionalidades necessárias.`,
    };
    
    await transporter.sendMail(mailOptions);
}

export default sendEmail;
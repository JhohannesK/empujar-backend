import nodemailer from "nodemailer";

const createTransporter = async () => {
   let testAccount = await nodemailer.createTestAccount();

   return nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.email",
      port: 587,
      secure: false,
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSWORD,
      },
   });
};

export const transporter = createTransporter().then((transporter) => transporter);
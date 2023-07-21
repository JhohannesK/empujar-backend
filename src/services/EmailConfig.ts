import nodemailer from "nodemailer";

const createTransporter = async () => {
   let testAccount = await nodemailer.createTestAccount();

   return nodemailer.createTransport({

      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
         user: testAccount.user,
         pass: testAccount.pass,
      },
   });
};

export const transporter = createTransporter().then((transporter) => transporter);
import { PrismaClient } from "@prisma/client";
import { transporter } from "./EmailConfig";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

/**
 * ##  sendVerificationEmail
 *  Send a verification email to the user.
 * 
 */
export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<void> => {
   console.log('Sending verification email to: ', email);

   try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
         console.error(`User not found for email: ${email}`);
         return;
      }

      const verificationLink = `http://localhost:8000/auth/reset-password?token=${verificationToken}`;

      const emailContent = {
         from:
         {
            name: 'Empujar 👻',
            address: process.env.EMAIL ?? '',
         },
         // `"John Kelvin 👻" <${process.env.EMAIL}>`,
         to: email,
         subject: 'Account Verification',
         html: `
        <p>Hello, ${user.name} </p>
        <p>Please click the following link to verify your account:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
        <p>Thank you!</p>
      `,
      };

      // Send the email
      (await transporter).sendMail(emailContent).then((info) => {
         console.log('Email sent: ', info.messageId);
         console.log('Preview URL: ', nodemailer.getTestMessageUrl(info))
      }).catch((error) => {
         console.error('Error sending email: ', error);
      });

   } catch (error) {
      console.error('Error sending verification email:', error);
   }
};

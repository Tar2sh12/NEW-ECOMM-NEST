import * as nodemailer from 'nodemailer';
import { EventEmitter } from 'events';
export const Events = new EventEmitter();
export const SendEmail = async (mailOptions: nodemailer.SendMailOptions) => {
  try {
    const transport: nodemailer.Transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +(process.env.EMAIL_PORT || 465),
      secure: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log('Sending email to: ', mailOptions.to);
    await transport.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.log('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

Events.on('sendEmail', (data) => {
  SendEmail(data);
});

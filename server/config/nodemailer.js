import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // false for TLS port 587
  auth: {
    user: '8e8f1a004@smtp-brevo.com',  // Your SMTP login
    pass: 'HpKJ7yBmv9b2FRGZ', // Your SMTP master password
  },
  tls: {
    rejectUnauthorized: false, // optional, useful for local dev
  },
});

export default transporter;

const emailConfig = {
  smtp: {
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    email: process.env.SMTP_EMAIL,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    secure: false,
  },
};
export { emailConfig as email };

const nodemailer=require('nodemailer');

module.exports={
  mailTransporter:nodemailer.createTransport({
    service:'gmail',
    auth:{
      user: 'anooptk3@gmail.com',
      pass: 'gsgifeirrxoherau'
    },
  }),
  OTP:`${Math.floor(1000+Math.random()*9000)}`,
}
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.CORREO_SECRET, // generated ethereal user
    pass: process.env.GOOGLE_SECRET, // generated ethereal password
  },
  tls:{
    rejectUnauthorized:false
  }
});

transporter.verify().then(()=>{
  console.log("conectado nodemailer para correo")
}).catch((err)=>{
  console.log(err);
})
module.exports = {
  transporter
}
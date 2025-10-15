const nodemailer=require("nodemailer")
module.exports.sendEmail =  async (msg) =>{
    const transporter = nodemailer.createTransport({
  port: 587,
  service : "gmail",
  secure: false, 
  auth: {
    user: "drashtiapani4@gmail.com",
    pass: "hvil ivyu sbhn lnry", 
  },
});
let res = await transporter.sendMail(msg);
return res;
}
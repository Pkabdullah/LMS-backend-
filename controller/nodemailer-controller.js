const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const sendEmail = async (req, res) => {
  const { to, subject,html} = req.body;
  const User = process.env.GMAIL_USERNAME
  const Password = process.env.GMAIL_PASS
const transporter = nodemailer.createTransport({
service:"gmail",
auth:{
    user:User,
     pass: Password
}
})
const mailOptions = {
  from:User,
  to,
  subject,
  html
};


try {
  const info = await transporter.sendMail(mailOptions);
  return res.status(200).json({ message: "Email sent", info });
} catch (err) {
  return res.status(500).json({ error: err.message });
}
};
module.exports = {sendEmail}

const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport(
  {
    service: "gmail",
    auth: {
      user: "deyaditya34@gmail.com",
      pass: "zuds airu fxbe bkzl"
    },
    secure: false,
    port: 587
  }
);

let mailOptions = {
  from: "deyaditya34@gmail.com",
  to: "deyaditya34@gmail.com",
  subject: "Hello from Node.js",
  text: "This email was sent using Nodemailer as a practice of sending mail through code.."
}

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("The error is -", error)
  }
  console.log("Email sent: %s -", info)
})
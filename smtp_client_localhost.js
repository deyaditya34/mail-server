const nodemailer = require("nodemailer");

// Create a transporter object using the local SMTP server
let transporter = nodemailer.createTransport({
  host: "127.0.0.1", // Local SMTP server
  port: 2525, // Port of your local SMTP server
  secure: false, // No SSL for local server
  auth: {
    user: "user@example.com", // User created on the SMTP server
    pass: "password123", // Password for the user
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
});

// Define email options
let mailOptions = {
  from: "user@example.com", // Sender address (must match authenticated user)
  to: "example@example.com", // List of recipients
  subject: "Hello", // Subject line
  text: "This is a test email.yguy uygyug ugyg uug uyg uyguy ygyg u", // Plain text body
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log("Error:", error);
  }
  console.log("Email sent:", info.response);
});

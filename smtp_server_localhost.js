const fs = require("fs");
const smtpServer = require("smtp-server").SMTPServer;

const server = new smtpServer({
  secure: false,
  // key: fs.readFileSync("/Users/adityadey/server.key"),
  // cert: fs.readFileSync("/Users/adityadey/server.crt"),
  disabledCommands: ["STARTTLS"],
  onConnect(session, callback) {
    // console.log("session -", session);
    callback();
  },

  onData(stream, session, callback) {
    console.log("receiving mail...");
    console.log("session -", session.envelope);
    let emailData = "";
    stream.on("data", (data) => {
      emailData += data;
    });

    stream.on("end", () => {
      console.log("received email data - \n", emailData);
      callback();
    });
  },

  onAuth(auth, session, callback) {
    console.log("authorization -", auth);
    const users = {
      "user@example.com": "password123",
    };
    if (users[auth.username] && users[auth.username] === auth.password) {
      return callback(null, { user: auth.username });
    } else {
      callback(new Error("Authentication failed"));
    }
  },
});

server.on("error", (err) => {
  console.log("error is -", err);
});

server.listen(2525, () => {
  console.log("smtp server is running on 2525");
});

const imap = require("imap");
const { inspect } = require("util");

const imapServer = new imap({
  user: "user@example.com",
  password: "password123",
  host: "127.0.0.1",
  port: 2525,
  tls: false,
  tlsOptions: { rejectUnauthorized: false },
});

function openInbox(cb) {
  imapServer.openBox("INBOX", true, cb);
}

function fetchNewEmails() {
  imapServer.search(["UNSEEN"], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const latestEmailUid = results.sort((a, b) => b - a)[0];
      let f = imapServer.fetch(latestEmailUid, {
        bodies: ["HEADER"],
        markSeen: false, // Marks the email as seen
        struct: true,
      });

      f.on("message", (msg, seqno) => {
        console.log("Message #%d", seqno);
        let prefix = "(#" + seqno + ") ";

        msg.on("body", (stream, info) => {
          let buffer = "";
          stream.on("data", (chunk) => {
            buffer += chunk.toString("utf8");
          });
          stream.once("end", () => {
            console.log("info about the mail :", info)
            if (info.which === "HEADER") {
              console.log(prefix + "Parsed header: %s", inspect(imap.parseHeader(buffer)));
            } else if (info.which === "TEXT") {
              console.log(prefix + "Parsed body: %s", buffer);
            }
          });
        });

        msg.once("end", () => {
          console.log(prefix + "Finished fetching message");
        });
      });

      f.once("error", (err) => {
        console.log("Fetch error: ", err);
      });

      f.once("end", () => {
        console.log("Done fetching all new messages!");
      });
    } else {
      console.log("No new emails.");
    }
  });
}

imapServer.once("ready", () => {
  openInbox((err, box) => {
    if (err) throw err;
    // console.log("Connected to inbox:", box);

    // Listen for new emails
    imapServer.on("mail", (numNewMsgs) => {
      console.log(
        `New mail detected (${numNewMsgs} new messages). Fetching...`,
      );
      fetchNewEmails(); // Fetch new emails when notified
    });

    // Also fetch any unseen emails on startup
    fetchNewEmails();
  });
});

imapServer.once("error", (err) => {
  console.log("IMAP Server Error:", err);
});

imapServer.once("end", () => {
  console.log("IMAP Connection ended");
});

imapServer.connect();

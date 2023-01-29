const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
});

async function send_reset_mail(email, link) {
  transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: email,
      subject: "Link to Reset Password",
      html: `
        <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
            <div style="margin:50px auto;width:70%;padding:20px 0">
                <p style="font-size:1.1em">Hello, Below is Link to reset password, valid for 10min</p>
                <a style="font-size:1.2em" href="${link}">Reset Password</a>
            </div>
        </div>
    `,
    },
    function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email Sent");
      }
    }
  );
}

module.exports = send_reset_mail;
const nodemailer = require("nodemailer");

async function sendNotification(message) {
  try {
    const parsed = JSON.parse(message);
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"Darrow au Andromedus" <thereaper@mars.com>',
      to: `${parsed.userId}`,
      subject: "Video to MP3 converter",
      text: `Your mp3 file link: http://mp3converter.com/api/mp3/download/${parsed.mp3Id}`,
      html: `<div>Your mp3 file link: <a href="http://mp3converter.com/api/mp3/download/${parsed.mp3Id}">http://mp3converter.com/api/mp3/download/${parsed.mp3Id}</a></div>`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Message preview: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    return error;
  }
}

module.exports = { sendNotification };

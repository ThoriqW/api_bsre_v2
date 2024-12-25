const QRCode = require("qrcode");
const sharp = require("sharp");

async function generateQRCodeWithLogo(text, logoPath, outputPath) {
  try {
    const qrBuffer = await QRCode.toBuffer(text, {
      type: "png",
      errorCorrectionLevel: "H",
      margin: 0.5,
      width: 300,
    });

    const logo = await sharp(logoPath).resize(70, 90).toBuffer();

    await sharp(qrBuffer)
      .composite([
        {
          input: logo,
          gravity: "center",
        },
      ])
      .toFile(outputPath);

    console.log("QR code berhasil dibuat dengan logo!");
  } catch (error) {
    console.error("Error generating QR code with logo:", error);
  }
}

module.exports = { generateQRCodeWithLogo };

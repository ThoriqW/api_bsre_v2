const express = require("express");
const multer = require("multer");
const axios = require("axios");
const { urlBSRE, username, password } = require("../config/tte_config");
const { generateQRCodeWithLogo } = require("../utils/qrcode_generator");

const fs = require("fs");
const path = require("path");
const { getCurrentDatetime } = require("../utils/datetime");

const router = express.Router();

const storageImageTte = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadImageTte = multer({ storage: storageImageTte });

router.post(
  "/sign/pdf",
  uploadImageTte.single("imageBase64"),
  async (req, res) => {
    try {
      const {
        idUser,
        namaPdf,
        nik,
        passphrase,
        tampilan = "VISIBLE",
        tag = "|",
        page = 1,
        originX = 0.0,
        originY = 0.0,
        width = 45.0,
        height = 45.0,
        location = "null",
        reason = "null",
      } = req.body;

      const qrText = `https://qrcodette.rssindhutrisnopalu.com/home/${location}/${idUser}/${namaPdf}`;
      const logoPath = path.join(__dirname, "../assets/logo.png");
      const qrCodePath = path.join(__dirname, `../qrcode/${nik}.png`);

      await generateQRCodeWithLogo(qrText, logoPath, qrCodePath);

      if (!qrCodePath || !namaPdf) {
        console.log("Image file or PDF not found.");
        return res.status(400).json({ error: "Image dan pdf harus di isi" });
      }

      const imagePath = qrCodePath;
      const imageData = fs.readFileSync(imagePath);
      const imageBase64 = imageData.toString("base64");

      let pdfPath;
      if (!fs.existsSync(path.join(__dirname, `../${location}`, namaPdf))) {
        pdfPath = path.join(__dirname, "uploads", namaPdf);
      } else {
        pdfPath = path.join(__dirname, `../${location}`, namaPdf);
      }
      const pdfData = fs.readFileSync(pdfPath);
      const pdfBase64 = pdfData.toString("base64");

      const authHeader =
        "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

      const response = await axios.post(
        `${urlBSRE}/api/v2/sign/pdf`,
        {
          nik: nik,
          passphrase: passphrase,
          signatureProperties: [
            {
              imageBase64: imageBase64,
              tampilan: tampilan,
              tag: tag,
              page: page,
              originX: originX,
              originY: originY,
              width: width,
              height: height,
              location: location,
              reason: reason,
            },
          ],
          file: [pdfBase64],
        },
        {
          headers: {
            Authorization: authHeader,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.status);

      if (
        response.status === 200 &&
        response.data &&
        Array.isArray(response.data.file) &&
        response.data.file.length > 0
      ) {
        try {
          const folderPath = path.join(location);

          if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
            console.log(`Folder ${folderPath} berhasil dibuat!`);
          }

          const fileData = Buffer.from(response.data.file[0], "base64");
          if (!fileData) {
            console.error("Invalid base64 file data");
            const hasil = {
              metadata: {
                message: "Gagal memproses data file.",
                code: 400,
              },
            };
            return res.json(hasil);
          }

          fs.writeFile(path.join(folderPath, namaPdf), fileData, (err) => {
            if (err) {
              console.error("Error saving the file:", err);
              const hasil = {
                metadata: {
                  message: "Gagal menyimpan file.",
                  code: 500,
                },
              };
              return res.json(hasil);
            } else {
              console.log("File successfully saved!");
            }
          });

          const hasil = {
            metadata: {
              message: "Dokumen berhasil ditanda tangani secara digital",
              code: response.status,
              datetime: getCurrentDatetime(),
            },
          };

          console.log(hasil);
          res.json(hasil);
        } catch (err) {
          console.error("Error in file processing:", err);
          const hasil = {
            metadata: {
              message: "Terjadi kesalahan saat memproses dokumen.",
              code: 500,
            },
          };
          return res.json(hasil);
        }
      } else if (response.status === 200 && response.data.error) {
        console.log(response.data);
        const hasil = {
          metadata: {
            message: `Dokumen gagal ditanda tangani secara digital, ${response.data.error}`,
            code: response.data.status_code,
          },
        };
        res.json(hasil);
      } else {
        console.log(response.data);
        const hasil = {
          metadata: {
            message:
              "Dokumen gagal ditanda tangani secara digital silahkan coba lagi",
            code: 400,
          },
        };
        console.log(hasil);
        res.json(hasil);
      }
    } catch (error) {
      const hasil = {
        metadata: {
          message:
            "Dokumen gagal ditanda tangani, vpn atau jaringan terputus silahkan coba lagi",
          code: 400,
        },
      };
      console.log(error);
      console.log(hasil);
      res.json(hasil);
    }
  }
);

module.exports = router;

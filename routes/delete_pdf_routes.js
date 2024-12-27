const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express();

const UPLOAD_DIR = path.join(__dirname, "../berkastte/");

router.delete("/delete/:location/:filename", async (req, res) => {
  try {
    const { filename, location } = req.params;
    const filePath = path.join(UPLOAD_DIR, location, filename);

    console.log(filePath);

    if (!fs.existsSync(filePath)) {
      const hasil = {
        metadata: {
          message: "Gagal hapus pdf!",
          code: 400,
        },
      };
      console.log(hasil);
      return res.json(hasil);
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file: ", err);
        return res
          .status(500)
          .json({ message: "Error deleting file.", error: err });
      }
      console.log("File deleted successfully!");
      res.status(200).json({ message: "File deleted successfully!" });
    });
  } catch (error) {
    console.error("Error handling delete request: ", error);
    res.status(500).json({ message: "Error handling delete request.", error });
  }
});

module.exports = router;

const express = require("express");
const { upload } = require("../utils/upload_pdf");

const router = express();

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    res
      .status(200)
      .json({ message: "File uploaded successfully!", file: req.file });
  } catch (error) {
    console.error("Error uploading file: ", error);
    res.status(500).json({ message: "Error uploading file.", error });
  }
});

module.exports = router;

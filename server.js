const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user_routes");
const uploadPdf = require("./routes/upload_pdf_routes");
const SignPdfRoutes = require("./routes/sign_pdf_routes");
const path = require("path");
const fs = require("fs");

const app = express();
const hostname = "127.0.0.1";
const port = 8000;

app.use(bodyParser.json());

//USER
app.use("/api/user", userRoutes);

//UPLOAD PDF
app.use(uploadPdf);

//SIGN PDF
app.use("/api/v2", SignPdfRoutes);

// Sajikan folder 'berkastte' sebagai direktori statis
app.use("/berkastte", express.static(path.join(__dirname, "berkastte")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

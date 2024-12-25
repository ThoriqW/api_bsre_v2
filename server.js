const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/user_routes");
const uploadPdf = require("./routes/upload_pdf_routes");
const SignPdfRoutes = require("./routes/sign_pdf_routes");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const hostname = process.env.SECRET_HOST_API_GATEWAY;
const port = process.env.SECRET_PORT_API_GATEWAY;

app.use(bodyParser.json());

//USER
app.use("/api/user", userRoutes);

//UPLOAD PDF
app.use(uploadPdf);

//SIGN PDF
app.use("/api/v2", SignPdfRoutes);

//AGAR BERKASTTE BISA DIAKSES DI BROWSER
app.use("/berkastte", express.static(path.join(__dirname, "berkastte")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

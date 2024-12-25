const dotenv = require("dotenv");

dotenv.config();

const urlBSRE = process.env.SECRET_HOST_BSSN;
const username = process.env.SECRET_USERNAME_BSSN;
const password = process.env.SECRET_PASSWORD_BSSN;

module.exports = { urlBSRE, username, password };

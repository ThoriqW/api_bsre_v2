const express = require("express");
const axios = require("axios");
const { urlBSRE, username, password } = require("../config/tte_config");

const router = express.Router();

router.post("/check/status", (req, res) => {
  const { nik } = req.body;

  const authHeader =
    "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

  axios
    .post(
      `${urlBSRE}/api/v2/user/check/status`,
      { nik: nik },
      {
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    )
    .then(function (response) {
      console.log(response.status);
      console.log(response.data);
      res.json(response.data);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error fetching user status");
    });
});

module.exports = router;

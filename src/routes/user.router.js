//Rutas para el registro

const express = require("express");
const router = express.Router();
const passport = require("passport");
const RegisterController = require("../controllers/user.controller.js");
const registerController = new RegisterController

// router.get("/failedregister", (req, res) => {
//     res.send("Registro fallido");
// })


// ////////// Registro con JWT////////////////////////////////////////////////

router.post("/", registerController.register)


module.exports = router;
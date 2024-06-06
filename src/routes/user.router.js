//Rutas para el registro

const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController
//Rutas login
const jwt = require("jsonwebtoken");


// //Version passport, usamos el middleware de passport
// router.post("/login", )

//Login con cookies JWT 
router.post("/login", userController.loginJwt)

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
  
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "./login" })),

//Cerrar sesion con JWT:
router.post("/logout", userController.logout)

//home
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);
    
//router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }),userController.githubCallback);

module.exports = router;
// router.get("/failedregister", (req, res) => {
//     res.send("Registro fallido");
// })


// ////////// Registro con JWT////////////////////////////////////////////////

router.post("/", userController.register)
router.get("/home", passport.authenticate("jwt"));

module.exports = router;
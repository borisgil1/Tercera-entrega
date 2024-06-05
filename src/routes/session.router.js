//Rutas login

const express = require("express");
const router = express.Router();
const LoginController = require("../controllers/sessions.controller.js");
const loginController = new LoginController;

// //Version passport, usamos el middleware de passport
// router.post("/login", )

//Login con cookies JWT 
router.post("/login", loginController.loginJwt)

//Ruta current 
router.get("/home", )

//Cerrar sesion con JWT:
router.post("/logout", loginController.logout)

//Version Github 
// router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

// router.get("/githubcallback", passport.authenticate("github", {
//     failureRedirect: "/login"
// }), async (req, res) => {
//     //La estrategia de Github nos retornará el usuario, entonces los agrego a mi objeto de Session: 
//     req.session.user = req.user;
//     //habilita la ruta
//     req.session.login = true;
//     //Redirijo al perfil
//     res.redirect("/profile");
// })

module.exports = router;
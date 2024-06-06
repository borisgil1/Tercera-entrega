const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController


//Register
router.post("/register", userController.register)

//Login 
router.post("/login", userController.loginJwt)

//Login Github
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
  
//Callback Github
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), userController.githubCallback);

//Cerrar sesion
router.post("/logout", userController.logout)

//Admin
router.get("/admin", passport.authenticate("jwt", { session: false }), userController.admin);

//Perfil
router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);


//Home
router.get("/home", passport.authenticate("jwt"));

module.exports = router;
const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller.js");
const userController = new UserController();
//const UserDTO = require("../dto/user.dto.js");


//Login con Passport
// router.post("/login", passport.authenticate("login", {failureRedirect: "/login", session: false}), userController.login);

//Logout con poassport
// router.post("/logout", userController.logout);

// //Registro con Passport
// router.post("/register", passport.authenticate("register"), userController.register);

//Login con JWT
router.post("/login", userController.loginJwt);

//Logout con JWT
router.post("/logout", userController.logoutJwt);

//Registro con JWT
router.post("/register", userController.registerJwt);

//Login con Github
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

//router.post("/login", userController.profile);

router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);

router.post("/products", userController.products);
// Callback de Github
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), userController.githubCallback);

module.exports = router;
//Rutas login

const express = require("express");
const router = express.Router();
const passport = require("passport");


//Version passport, usamos el middleware de passport
router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin"
}), async (req, res) => {
    if (!req.user) {
        return res.status(400).send("Credenciales invalidas");
    } else {

        //generamos la sesion
        req.session.user = {
            first_name: req.first_name,
            last_name: req.last_name,
            age: req.age,
            email: req.email,
        }
    }

    //indicar que el usuario inició sesión correctamente
    req.session.login = true;

    res.redirect("/products")
})

router.get("/faillogin", async (req, res)=>{
    res.send("Login fallido");
})

//Cerrar sesion:
router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login")
})


//Version Github 
router.get("/github", passport.authenticate("github",{scope: ["user:email"]})), async (req, res)=>{
}

router.get("/githubcallback", passport.authenticate("github", {
    failureRedirect: "/login"}), async (req, res) => {
        //Retrona el usuario, lo argego a mi objeto de Session:
        req.session.user = req.user;
        req.session.login = true;
        res.redirect("/profile")
    }),
    
module.exports = router;
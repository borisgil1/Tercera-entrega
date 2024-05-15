//Rutas para el registro

const express = require("express");
const router = express.Router();
const passport = require("passport");


//Version passport
//Estrategia local
router.post("/", passport.authenticate("register", {
    //si falla la estrategia de registro me redirige a failedregister
    failureRedirect: "/failedregister"
}), async (req, res) => {
    // si no hay user, dame el return
    if (!req.user) {
        return res.status(400).send("Credenciales invalidas");
    } else {

        req.session.user = {
            first_name: req.first_name,
            last_name: req.last_name,
            age: req.age,
            email: req.email,
        }
    }

    req.session.login = true;

    res.redirect("/profile")

})


router.get("/failedregister", (req, res)=>{
    res.send("Registro fallido");
})

module.exports = router;
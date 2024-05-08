const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js")


//Verificamos el usuario: 
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email: email });
        if (user) {
            if (user.password === password) {
                req.session.login = true,
                    req.session.user = {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                        password: user.password,
                        age: user.age
                    }
                res.redirect("/profile");
            } else {
                res.status(401).send("Contraseña no válida");
            }
        } else {
            res.status(404).send("Usuario no encontrado");
        }
    } catch (error) {
        return res.status(400).send("Error en el login");
    }
});


//Cerrar sesion:

router.post("/logout", (req, res)=>{
        if (req.session.login) {
            req.session.destroy();
            //res.send("Sesión Cerrada!");
        } 
            res.redirect("/login")
    })



module.exports = router;
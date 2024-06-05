//Controller login

const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcrypt.js");
const jwt = require("jsonwebtoken");


class LoginController {

    // //Version passport, usamos el middleware de passport
    // router.post("/login", passport.authenticate("login", {
    //     failureRedirect: "/api/sessions/faillogin"
    // }), async (req, res) => {
    //     if (!req.user) {
    //         return res.status(400).send("Credenciales invalidas");
    //     } else {

    //         //generamos la sesion
    //         req.session.user = {
    //             first_name: req.first_name,
    //             last_name: req.last_name,
    //             age: req.age,
    //             email: req.email,
    //         }
    //     }

    //     //indicar que el usuario inició sesión correctamente
    //     req.session.login = true;

    //     res.redirect("/products")
    // })


    // router.get("/faillogin", async (req, res) => {
    //     res.send("Login fallido");
    // })



// //Version Github 
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


////////////////////////JWT////////////////////////////////////////////////////////////////////


//Login con cookies JWT 
async loginJwt (req, res) {
    let { email, password } = req.body;

    try {

        //verificacion si exite usuario con ese mail
        let user = await UserModel.findOne({ email });

        //Si no existe el usuario retorna error
        if (!user) {
            console.log("Este usuario no existe");
            return res.status(400).send("El usuario no existe");
        }

        //si existe verifico la contraseña
        if (!isValidPassword(password, user)) {
            return res.status(401).send("Contraseña incorrecta");
        }

        //Generamos el token
        let token = jwt.sign(
            {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                rol: user.role
            },
            "coderhouse",
            { expiresIn: "24h" }
        );

        //Establecer token como cookie
        res.cookie("coderCookieToken", token, { maxAge: 60 * 60 * 1000, httpOnly: true });

        res.redirect("/home")


    } catch (error) {
        res.status(500).send("Error interno del servidor")
        console.log(error)
    }

}


//Cerrar sesion con JWT:
async logout(req, res) {
    //limpio la cookie del token
    res.clearCookie("coderCookieToken");
    //Redirigir al login.
    res.redirect("/login");
}

//Ruta current 

// router.get("/home", passport.authenticate("jwt", { session: false }), (req, res) => {
//     res.render("home", { usuario: req.user.email });
// })

}


module.exports = LoginController;
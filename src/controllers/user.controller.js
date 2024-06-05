//Registro Controller

const UserModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const { createHash } = require("../utils/hashbcrypt.js");


class RegisterController {

    //Registro con JWT
    async register(req, res) {
        let { first_name, last_name, email, password, age, rol } = req.body;

        try {
            //Verificar si el usuario existe en la bdd
            const existingUser = await UserModel.findOne({ email })

            //si es usuario existe
            if (existingUser) {
                return res.status(400).send("El usuario ya existe")
            }
            //si no existe lo creo
            const newUser = new UserModel({
                first_name,
                last_name,
                age,
                email,
                password: createHash(password)

            })

            //Lo guardo en la bdd
            await newUser.save();

            //Generamos el token
            let token = jwt.sign({
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                age: newUser.age,
                role: newUser.role
            }, "coderhouse", { expiresIn: "24h" });

            //Enviar token desde una cookie
            //                Clave        valor          tiempo     solo se accede desde http
            res.cookie("coderCookieToken", token, { maxAge: 60 * 60 * 1000, httpOnly: true });

            //una vez me registro me lleva al home
            res.redirect("/home")

        } catch (error) {
            res.status(500).send("Error interno del servidor")
            console.log(error)
        }


    }

    // router.get("/failedregister", (req, res) => {
    //     res.send("Registro fallido");
    // })
}


module.exports = RegisterController;
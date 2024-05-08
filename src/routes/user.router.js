const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js")


//Genera usuario y lo almacena
router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send("El correo ya está registrado")
        } else {
            const newUser = await UserModel.create({ first_name, last_name, email, password, age });

            req.session.user = {
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                password: newUser.password,
                age: newUser.age
            }
            req.session.login = true;

            res.status(200).send("Usuario registrado con éxito");
        }

    } catch (error) {
        res.status(500).send("Error al crear el usuario");
    }
})



module.exports = router;
const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js")
const { createHash } = require("../utils/hashbcrypt.js");


//Registra el usuario y lo guarda
router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age, role } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send("El correo ya está registrado")
        }

        const role = email === 'admincoder@coder.com' ? 'admin' : 'usuario';

        const newUser = await UserModel.create({ first_name, last_name, email, password: createHash(password), age, role });

        req.session.user = {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            password: newUser.password,
            age: newUser.age,
            role: newUser.role,
        }

        req.session.login = true;
        //req.session.user = { ...newUser._doc };
        //res.status(200).send("Usuario registrado con éxito");
        res.redirect("/products");
    }

    catch (error) {
        res.status(500).send("Error al crear el usuario");
        console.log(error)
    }
})


module.exports = router;
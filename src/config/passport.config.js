const express = require("express");
const passport = require("passport");
const local = require("passport-local");
const UserModel = require("../models/user.model.js");
const { createHash } = require("../utils/hashbcrypt.js");
const { isValidPassword } = require("../utils/hashbcrypt.js");
//GitHub
const GitHubStrategy = require("passport-github2");

const LocalStrategy = local.Strategy;

const initializePassport = () => {

    //estrategia registro y login
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",
    }, async (req, username, password, done) => {
        //levantamos del body
        const { first_name, last_name, email, age } = req.body;

        try {
            //verificacion si el email ya existe en la base de datos
            let user = await UserModel.findOne({ email });

            if (user) {
                //si ya existe ejecutamos el done con el error
                return done(null, false)
            } else {
                //si no existe creamos nuevo usuario
                let newUser = {
                    first_name,
                    last_name,
                    email,
                    password: createHash(password),
                    age
                }

                // cargamos en la bdd
                let result = await UserModel.create(newUser);

                // esto hace se carge en req.user la info del usuario
                return done(null, result);
            }

        } catch (error) {
            return done(error);
        }
    }))


    passport.use("login", new LocalStrategy({
        usernameField: "email",
    }, async (email, password, done) => {

        try {
            //verificacion si exite usuario con ese mail
            let user = await UserModel.findOne({ email });

            if (!user) {
                console.log("Este usuario no existe");
                return done(null, false);
            }

            //si existe verifico la contraseña
            if (!isValidPassword(password, user)) {
                return done(null, false);
            }

            // cargamos en req.user el usuario
            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }))


    //Serializar y deserializar: colocar el objeto del usuario en la session y quitarlo en el logout
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id })
        done(null, user);
    })


    //Estrategia GitHub
    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liFlbTv1vLSwsBaE",
        clientSecret : "40d2c52ebde75da0501a24c157d5bdd76d6cd168",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"

    }, async (accessToken, refreshToken, profile, done) => {

        //Veo los datos del perfil
        console.log("profile:", profile);

        try {
            let user = await UserModel.findOne({ email: profile._json.email });

            if (!user) {
                //Crear nuevo usuario
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 36,
                    email: profile._json.email,
                    password: ""
                }

                let result = await UserModel.create(newUser);
                done(null, result);

            } else {
                //Ya está creado, lo enviamos
                done(null, user)
            }

        } catch (error) {
            return done(error)
        }

    }))
}


module.exports = initializePassport;
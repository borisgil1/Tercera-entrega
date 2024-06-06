//Estrategias de passport

const passport = require("passport");
const UserModel = require("../models/user.model.js");
//passport-jwt
const jwt = require("passport-jwt")
//instanciar nueva estragegia
const JWTStrategy = jwt.Strategy;
//decodificar el tooken que está dentro de la cookie
const ExtractJwt = jwt.ExtractJwt;
//GitHub
const GitHubStrategy = require("passport-github2");


//Funcion initialize Passport
const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // Utiliza ExtractJwt.fromExtractors para extraer el token de la cookie
        secretOrKey: "coderhouse"
    }, async (jwt_payload, done) => {
        try {
            // Busca el usuario en la base de datos usando el ID del payload JWT
            const user = await UserModel.findById(jwt_payload.user._id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user); // Devuelve el usuario encontrado
        } catch (error) {
            return done(error);
        }
    }));

 
 

    //Serializar y deserializar: colocar el objeto del usuario en la session y quitarlo en el logout
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id })
        done(null, user);
    })
}

//////////////////////////////////////////////////////////////////////////

//Estrategia GitHub
passport.use("github", new GitHubStrategy({
    clientID: "Iv23lioElT1WDsKkIYOd",
    clientSecret: "b6ba3fd2fae4f054c6d40630b42c78bcbd80f5b6",
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"

}, async (accessToken, refreshToken, profile, done) => {
    //Veo los datos del perfil
    console.log("Profile:", profile);

    try {
        let user = await UserModel.findOne({ email: profile._json.email });

        if (!user) {
            //Crear nuevo usuario si no existe
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
            done(null, user);
        }
    } catch (error) {
        return done(error);
    }
}))

   //funcion que decofidica la cookie, extractor de cookies
   const cookieExtractor = (req) => {
        // inicializar la variable token como null
        let token = null;
        //si hay request y existen las cookies
        if (req && req.cookies) {
            //Si se dan las conidicones el token va a estar cargado con esta cookie 
            token = req.cookies["coderCookieToken"];
        }
        //si existe lo guardamos, y si lo podemos guardar lo enviamos, lo retornamos
        return token;
    }

module.exports = initializePassport;
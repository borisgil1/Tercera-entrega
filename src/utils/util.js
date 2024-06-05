// const passport = require("passport");

// const passportCall = (strategy) => {
//     return async (req, res, next) => {
//         passport.authenticate(strategy, (error, user, info) => {
//             if (error) {
//                 return next(error);
//             }

//             if (!user) {
//                 res.status(401).send({ error: info.messege ? info.messege : info.toString() })
//             }
//             req.user = user;
//             next()
//         })(req, res, next)
//     }
// }


// //Autorización según el rol
// const authorization = (role) => {
//     return async (req, res, next) => {
//         //si en el usuario q tenemos cargado el rol no coincide con el rol que yo 
//         //estoy pasando por parametro cada vez que quiero usar este middleware, mensaje negativo
//         if (req.user.rol !== role) {
//             return res.status(403).send({ messege: "No tienes permiso" });
//         }
//         next();
//     }
// }

// module.exports = {
//     passportCall,
//     authorization
// };
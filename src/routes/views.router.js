//Views, profile   

const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const viewsController = new ViewsController
const passport = require("passport");
const UserDTO = require("../dto/user.dto.js");
const { passportCall } = require("../utils/util.js");
const { authorization } = require("../utils/util.js");


//vista products, muestra todos los productos
//router.get("/products", passportCall("jwt"), authorization("usuario"), viewsController.renderProducts)
router.get("/products", passport.authenticate('jwt', { session: false }), viewsController.renderProducts);

//router.get("/products", viewsController.renderProducts);

//vista cart, muestra los productos que tiene cada carrito
router.get("/carts/:cid", passport.authenticate("jwt", { session: false }), viewsController.renderCart);

//Vista raiz app, productos
router.get("/", viewsController.login);

router.get("/chat", passportCall("jwt"), authorization("usuario"), viewsController.chat)

router.get("/login", viewsController.login);

// router.get("/profile", passport.authenticate("jwt", { session: false }), async (req, res) => {
//     // Aquí `req.user` debería estar definido correctamente si el usuario está autenticado
//     const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
//     const isAdmin = req.user.role === 'admin';
//     res.render("profile", { user: userDto, isAdmin });
// });

router.get("/register", viewsController.register);

router.get("/home", viewsController.home);

router.get("/admin", viewsController.admin);

router.get("/realtimeproducts", passportCall("jwt"), authorization("admin"), viewsController.realTime)

router.get("/recover", viewsController.recover)
//router.get("/profile", passport.authenticate("jwt", { session: false }), viewsController.profile);
router.get("/contact", viewsController.contact)

router.get("/profile", passport.authenticate("jwt", { session: false }), viewsController.profile);

//A esta ruta hay ponerle un DTO para que solo mande nombre, apellido y rol
router.get("/current", passportCall("jwt"), (req, res) => {
    const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
    const isAdmin = req.user.role === 'admin';
    res.send(("profile", { Usuario: userDto, isAdmin }));
})

router.get("/current2", passportCall("jwt"), authorization("admin"), (req, res) => {
    res.send(req.user.cart);
})

module.exports = router;
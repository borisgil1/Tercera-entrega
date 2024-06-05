const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/views.controller.js");
const viewsController = new ViewsController

//vista products, muestra todos los productos
router.get("/products", viewsController.renderProducts );

//vista cart, muestra los productos que tiene cada carrito
router.get("/carts/:cid", viewsController.renderCart);

//Vista raiz app
router.get("/", viewsController.login);

router.get("/realtimeproducts", viewsController.realTimeProducts);

router.get("/chat", viewsController.chat);

router.get("/login", viewsController.login);

router.get("/profile", viewsController.profile);

router.get("/register", viewsController.register);

router.get("/home", viewsController.home);

router.get("/admin", viewsController.admin)

module.exports = router;
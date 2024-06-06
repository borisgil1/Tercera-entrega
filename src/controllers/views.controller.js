
const CartRepository = require("../repository/cart.repository.js");
const ProductsModel = require("../models/products.model.js");
const cartRepository = new CartRepository();


//Vista productos

class viewsController {

    async renderProducts(req, res) {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;

        try {
            const products = await ProductsModel.paginate({}, { limit, page });
            const final = products.docs.map(products => {
                const { _id, ...rest } = products.toObject();
                return rest;
            })
            res.render("products", {
                user: req.session.user,
                products: final,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                currentPage: products.page,
                totalPages: products.totalPages,
            });

        } catch (error) {
            res.status(500).json({ error: "Error interno del servidor" })
        }
    };

    //vista cart, muestra los productos que tiene cada carrito
    async renderCart(req, res) {
        let cid = req.params.cid;
        try {
            const cart = await cartRepository.getCartById(cid);

            if (cart) {

                const productsInCar = cart.products.map(item => ({
                    product: item.product.toObject(),
                    //Lo convertimos a objeto para pasar las restricciones de Exp Handlebars. 
                    quantity: item.quantity
                }));

                res.render("carts", { products: productsInCar });

            } else {
                return res.status(404).send("Carrito no encontrado")
            }

        } catch (error) {
            console.error("Error al mostrar carrito", error);
            return res.status(500).send("Error al mostrar carrito");
        }
    };

    async login(req, res) {
        res.render("login");
    }

    async realTimeProducts(req, res) {
        res.render("realTimeProducts");
    };


    async chat(req, res) {
        res.render("chat");
    }


    async profile(req, res) {
        if (!req.session.login) {
            return res.redirect("/login")
        }
        res.render("profile");
    }

    async register(req, res) {
        res.render("register");
    }

    async home (req, res) {
        res.render("home");
    };

    async chat (req, res) {
        res.render("chat");
    };

    async admin (req, res) {
        res.render("admin");
    };

}

module.exports = viewsController;
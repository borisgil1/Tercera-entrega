const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cartManager.js");
const ProductManager = require("../controllers/productManager.js");
const cartManager = new CartManager();
const productManager = new ProductManager();

//Crear carrito
router.post("/", async (req, res) => {
    try {
        const newCartId = CartManager.lastId + 1;
        const newCart = {
            id: newCartId,
            products: []
        };
        CartManager.lastId++;
        await cartManager.addCart(newCart);
        return res.status(201).send({ message: "Carrito nuevo agregado", newCart });
    } catch (error) {
        console.error("Error al crear nuevo carrito", error);
        return res.status(500).send("Error al crear nuevo carrito");
    }
});

//Mostrar carrito por ID
router.get("/:cid", async (req, res) => {
    try {
        let cid = parseInt(req.params.cid);
        const cart = await cartManager.getCartsById(cid);
        if (cart) {
            return res.send(cart);
        } else {
            return res.status(404).send("Carrito no encontrado")
        }
    } catch (error) {
        console.error("Error al mostrar carrito", error);
        return res.status(500).send("Error al mostrar carrito");
    }
});

//Mostrar todos los carritos
router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        return res.status(200).send(carts);
    } catch (error) {
        console.error("Error al mostrar carritos:", error);
        return res.status(500).send("Error al mostrar carritos")
    }
});

//Agregar producto a carrito
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cartId = parseInt(cid);
        const productId = parseInt(pid);
        const foundProduct = await productManager.getProductById(productId);
        const foundCart = await cartManager.getCartsById(cartId);
        if (!foundProduct || !foundCart) {
            return res.status(404).send({ message: "Producto o carrito no encontrado" });
        }
        const existingProduct = foundCart.products.findIndex(product => product.product === productId);
        if (existingProduct !== -1) {
            foundCart.products[existingProduct].quantity += parseInt(quantity);
        } else {
            foundCart.products.push({
                product: productId,
                quantity: parseInt(quantity),
            });
        }
        await cartManager.saveCartsToFile();
        return res.status(200).send({ message: "Producto agregado al carrito con éxito", cart: foundCart });
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        return res.status(500).send("Error al agregar producto al carrito:")
    }
});

module.exports = router;
const express = require("express");
const ProductManager = require("../main.js");
const path = require("path");

const PUERTO = 8080;

const app = express();

const productManager = new ProductManager();

app.get("/products", async (req, res) => {
    const products = await productManager.getProducts();
    let limit = parseInt(req.query.limit);
    if (limit) {
        let limitedProducts = products.slice(0, limit);
        return res.send(limitedProducts);
    } else {
        return res.send(products);
    }
});

app.get("/products/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    const product = await productManager.getProductById(id);
    if (product) {
        return res.send(product);
    } else {
        return res.send("Producto no encontrado");
    }
});

app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
})


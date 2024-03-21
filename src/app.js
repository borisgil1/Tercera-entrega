const express = require("express");
const ProductManager = require("./controllers/productManager.js");
const CartManager = require("./controllers/cartManager.js");
const path = require("path");
const PUERTO = 8080;
const app = express();
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const productManager = new ProductManager();

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
})
app.use(express.static("public"));


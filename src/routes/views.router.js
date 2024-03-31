const express = require("express");
const router = express.Router();
const fs = require("fs");
const ProductManager = require("../controllers/productManager")
const productManager = new ProductManager("src/models/productManager.json")

router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("home", { productos, titulo: "Plantilla" });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" })
    }
});

router.get("/realtimeproducts", (req, res) => {
        res.render("realTimeProducts");
})

router.get("/contacto", (req, res) => {
    res.render("contacto");
})

module.exports = router;
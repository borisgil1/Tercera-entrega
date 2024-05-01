const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager")
const ProductsModel = require("../models/products.model.js");
const productManager = new ProductManager("src/models/productManager.json")

router.get("/", async (req, res) => {
    const page = req.query || 1;
    let limit = 1;
  
    try {  
        const products = await ProductsModel.paginate({}, {limit, page});
         console.log(products)
        const final = products.docs.map(products => {
            const {_id, ...rest} = products.toObject();
            return rest;
        })
        res.render("Home", { 
            products: final,
            hasPrevPage: products.hasPrevPage, 
            hasNextPage: products.hasNextPage, 
            prevPage: products.prevPage, 
            nextPage: products.nextPage, 
            currentPage: products.page,
            totalPages: products.totalPages
        });
      
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

router.get("/chat", (req, res) => {
    res.render("chat");
})

module.exports = router;
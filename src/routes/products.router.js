const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();

//Mostar productos - limite
router.get("/", productController.getProducts);

//Mostrar productos por ID
router.get("/:id", productController.getProductById);

//Agregar productos
router.post("/", productController.addProduct);

//Actualizar productos
router.put("/:id", productController.updateProduct)

//Eliminar productos
router.delete("/:pid", productController.deleteProduct)

module.exports = router;
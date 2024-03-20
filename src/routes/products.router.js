const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/productManager.js");
const productManager = new ProductManager();

//Mostar productos - limite
router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    let limit = parseInt(req.query.limit);
    if (limit) {
        let limitedProducts = products.slice(0, limit);
        return res.send(limitedProducts);
    } else {
        return res.send(products);
    }
});

//Mostrar productos por ID
router.get("/:id", async (req, res) => {
    let id = parseInt(req.params.id);
    const product = await productManager.getProductById(id);
    if (product) {
        return res.send(product);
    } else {
        return res.send("Producto no encontrado");
    }
});

//Agregar productos
router.post("/", async (req, res) => {
    const { title, description, price, img, code, stock, category } = req.body;
    if (!title || !description || !price || !img || !code || !stock || !category) {
        return res.status(400).send({ message: "Favor llenar todos los campos" });
    }
    const newProduct = await productManager.addProduct(title, description, price, img, code, stock, category);
    if (!newProduct) {
        console.log(newProduct)
        return res.status(500).send({ message: "Error al agregar el producto" });
    }
    console.log("Producto agregado:", newProduct);
    res.status(201).send({ message: "Producto nuevo agregado", product: newProduct });
});

//Actualizar productos
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, img, code, stock, category } = req.body;
    const productUpdated = await productManager.updateProduct(id, { title, description, price, img, code, stock, category});
    if (!productUpdated) {
        return res.status(500).send({ message: "Error al modificar producto" });
    } 
        console.log("Producto modificado:", productUpdated);
        res.status(200).send({ message: "Producto modificado", product: productUpdated });
})


//Eliminar productos
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const productToDelete = await productManager.deleteProduct(id);
    if (!productToDelete) {
        return res.status(404).send({ message: "Producto no encontrado" });
    } 
        console.log("Producto eliminado:", productToDelete);
        res.status(200).send({ message: "Producto eliminado correctamente", product: productToDelete });
})

module.exports = router;
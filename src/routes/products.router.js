const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager.js");
const productManager = new ProductManager();

//Mostar productos - limite
router.get("/", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        let limit = parseInt(req.query.limit);
        if (limit) {
            let limitedProducts = products.slice(0, limit);
            return res.send(limitedProducts);
        } else {
            return res.send(products);
        }
    }
    catch (error) {
        return res.status(500).send("Error al obtener los productos");
    }
});

//Mostrar productos por ID
router.get("/:id", async (req, res) => {
    try {
        let id = parseInt(req.params.id);
        const product = await productManager.getProductById(id);
        if (product) {
            return res.send(product);
        } else {
            return res.send("Producto no encontrado");
        }
    } catch (error) {
        return res.status(500).send("Error al encontrar el producto");
    }
});

//Agregar productos
router.post("/", async (req, res) => {
    try {
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
    } catch (error) {
        return res.status(500).send("Error al agregar el producto");
    }
});

//Actualizar productos
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, img, code, stock, category } = req.body;
    try {
        const productUpdated = await productManager.updateProduct(id, { title, description, price, img, code, stock, category });
        if (!productUpdated) {
            return res.status(500).send({ message: "Error al modificar producto" });
        }
        console.log("Producto modificado:", productUpdated);
        return res.status(200).send({ message: "Producto modificado", product: productUpdated });
    } catch (error) {
        console.error("Error al modificar el producto:", error);
        return res.status(500).send("Error al modificar el producto");
    }
})

//Eliminar productos
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const productToDelete = await productManager.deleteProduct(id);
        if (!productToDelete) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }
        console.log("Producto eliminado:", productToDelete);
        return res.status(200).send({ message: "Producto eliminado correctamente", product: productToDelete });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        return res.status(500).send("Error al eliminar el producto");
    }
})

module.exports = router;
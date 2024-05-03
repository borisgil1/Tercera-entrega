const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager.js");
const ProductsModel = require("../models/products.model.js");
const productManager = new ProductManager();

//Mostar productos - limite
router.get("/", async (req, res) => {
     const page = req.query.page || 1;
    const limit = req.query.limit || 20; 
    try {
        const products = await ProductsModel.paginate();
      
        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage,
            nextLink: products.hasNextPage
        });
       
    } catch (error) {
        res.status(500).send("Error al obtener los productos");
    }
});

//Mostrar productos por ID
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    try {
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
    const newProduct = req.body;
    try {
        const existingProduct = await ProductsModel.findOne({ code: newProduct.code });
        if (existingProduct) {
            // Si existe un producto con el mismo código, devuelve un mensaje de error
            return res.status(400).json({ message: "El código debe ser único" });
        }
        await productManager.addProduct(newProduct);
        res.status(201).send({ message: "Producto agregado exitosamente", newProduct });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
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
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;
    console.log(id)
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
const ProductRepository = require("../repository/product.repository");
const {productService} = require("../service/index");


class productController {

    //Mostar productos
    async getProducts(req, res) {
       try {
        const products = await productService.getProducts();
        return res.send(products);
       } catch (error) {
        console.error("Error al mostrar productos", error);
        return res.status(500).send("Error al mostrar productos");
       }
    };

    //Mostrar productos por ID
    async getProductById(req, res) {
        let id = req.params.id;
        try {
            const product = await productService.getProductById(id);
            if (product) {
                return res.status(201).send({ message: "Producto encontrado exitosamente", product });
            } else {
                return res.send("Producto no encontrado");
            }
        } catch (error) {
            return res.status(500).send("Error al encontrar el producto");
        }
    };

    //Agregar productos
    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const product = await productService.addProduct(newProduct);
            if (existingProduct) {
                // Si existe un producto con el mismo código, devuelve un mensaje de error
                return res.status(400).json({ message: "El código debe ser único" });
            }
            await productService.addProduct(newProduct);
            res.status(201).send({ message: "Producto agregado exitosamente", newProduct });
        } catch (error) {
            console.error("Error al agregar producto", error);
            res.status(500).json({
                error: "Error interno del servidor"
            });
        }
    };

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const product = await productService.addProduct(newProduct);
            res.json({message: "El producto ha sido agregado", product: product}); 
        } catch (error) {
            res.status(400).json({ error: error.message }); 
        }
    }


    //Actualizar productos
    async updateProduct(req, res) {
        const { id } = req.params;
        const { title, description, price, img, code, stock, category } = req.body;
        try {
            const productUpdated = await productService.updateProduct(id, { title, description, price, img, code, stock, category });
            if (!productUpdated) {
                return res.status(500).send({ message: "Error al modificar producto" });
            }
            console.log("Producto modificado:", productUpdated);
            return res.status(200).send({ message: "Producto modificado", product: productUpdated });
        } catch (error) {
            console.error("Error al modificar el producto:", error);
            return res.status(500).send("Error al modificar el producto");
        }
    }

    //Eliminar productos
    async deleteProduct(req, res) {
        const id = req.params.pid;
        console.log(id)
        try {
            const productToDelete = await productService.deleteProduct(id);
            if (!productToDelete) {
                return res.status(404).send({ message: "Producto no encontrado" });
            }
            console.log("Producto eliminado:", productToDelete);
            return res.status(200).send({ message: "Producto eliminado correctamente", product: productToDelete });
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            return res.status(500).send("Error al eliminar el producto");
        }
    }
}
module.exports = productController;
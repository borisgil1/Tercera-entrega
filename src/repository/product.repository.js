
const ProductsModel = require("../models/products.model");

class ProductRepository {
    
    async addProduct({title, description, price, img, code, stock, category, thumbnails}) {
        try {
            if(!title|| !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return; 
            }

            const existeProducto = await ProductsModel.findOne({code: code});

            if(existeProducto) {
                console.log("El código debe ser unico");
                return;
            }

            const nuevoProducto = new ProductsModel({
                title, 
                description, 
                price, 
                img, 
                code,
                stock, 
                category, 
                status: true, 
                thumbnails: thumbnails || []
            });

            await nuevoProducto.save(); 

        } catch (error) {
            console.log("Error al agregar un producto", error); 
            throw error; 
        }
    }


   async getProducts() {
        try {
            const products = await ProductsModel.find();
            return products;
        } catch (error) {
            console.log("Error al recuperar los productos", error);
            throw error;
        }
    }


    async getProductById(id) {
        try {
            const product = await ProductsModel.findById(id);
            if (!product) {
                console.log(`Producto con ID "${id}" no encontrado`);
                return null;
            } else {
                console.log("Producto encontrado:", product);
                return product;
            }
        } catch (error) {
            console.error("Error al encontrar producto por ID:", error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const updatedProduct = await ProductsModel.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!updatedProduct) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto actualizado correctamente:", updatedProduct);
            return updatedProduct;
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductsModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                console.log("Producto no encontrado");
                return null;
            }
            console.log("Producto eliminado correctamente:", deletedProduct);
            return deletedProduct;
        } catch (error) {
            console.error("Error al eliminar Producto:", error);
            throw error;
        }
    }
}

module.exports = ProductRepository;



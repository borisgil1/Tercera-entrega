const express = require("express");
const path = require("path");
const PUERTO = 8080;
const app = express();
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const exphbs = require("express-handlebars");
const socket = require("socket.io");
//const fs = require("fs");
const ProductManager = require("./controllers/productManager.js");
const productManager = new ProductManager();
require("./database.js");
const MessagesModel = require("./models/messages.model.js")


//Handlebar
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
})

//instancia Socket del servidor
const io = socket(httpServer);

//Conección cliente
io.on("connection", async (socket) => {
    console.log("Un cliente se conectó");

    //Enviar mensaje para renderizar productos
    const products = await productManager.getProducts();
    socket.emit("products", products);
    //console.log(products)

    //Recibir evento eliminar producto
    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        //Evniamos array actualizado
        socket.emit("products", await productManager.getProducts());
    })

    //Recibir evento agg producto desde cliente
    socket.on("addProduct", async (product) => {
        await productManager.addProduct(product.title, product.description, product.price, product.img, product.code, product.stock, product.category, product.status);
        socket.emit("products", await productManager.getProducts());
        //io.emit("products", await productManager.getProducts());
    })
});


//const io = new socket.Server(httpServer)
//chat
io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {
       await MessagesModel.create(data);

        //obtengo mensajes de mongo
        const messages = await MessagesModel.find();
        console.log(messages)
        io.emit("messagesLogs", messages);
    })
})

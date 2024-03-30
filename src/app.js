const express = require("express");
const path = require("path");
const PUERTO = 8080;
const app = express();
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const exphbs = require("express-handlebars");
const { Server } = require("socket.io");
const fs = require("fs");

//const ProductManager = require("./controllers/productManager.js");
//const CartManager = require("./controllers/cartManager.js");

//Handlebar
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
//const productManager = new ProductManager();

//Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Listen
const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`);
})

//instancia Socket del servidor
const io = new Server(httpServer);

//Conección cliente
io.on("connection", (socket) => {
    console.log("Un cliente se conectó");
    socket.on("mensaje", (data) => {
        console.log(data);
    })

    socket.emit("saludo", "Hola cliente, que tal?");

    fs.readFile("src/models/productManager.json", "utf8", (err, data) => {
        if (err) {
            console.error("Error al leer el archivo productos.json:", err);
            return;
        }
        socket.emit("products", JSON.parse(data));
    });
})








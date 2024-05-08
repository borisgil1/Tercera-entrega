const mongoose = require("mongoose");

//Conexión mongoose
mongoose.connect("mongodb+srv://coderhouse:coderhouse@cluster0.2zgtivj.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>console.log("Conexión exitosa"))
    .catch((error)=>console.log("Error en la conexión", error))
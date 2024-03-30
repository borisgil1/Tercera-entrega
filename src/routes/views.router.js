const express = require("express");
const router = express.Router();

const arrayProductos = [
    { nombre: "Camisa", descripcion: "Hecha de algodón suave y transpirable.", precio: 25.99 },
    { nombre: "Zapatos", descripcion: "Zapatos deportivos ligeros.", precio: 49.99 },
    { nombre: "Teléfono", descripcion: "Teléfono inteligente.", precio: 699.99 },
    { nombre: "Auriculares", descripcion: "Con cancelación de ruido y batería de larga duración.", precio: 129.99 }
];

router.get("/", (req, res) => {
    const usuario = {
        nombre: "Ivan",
        apellido: "Gil",
        mayorEdad: false
    }
    res.render("index", { usuario, arrayProductos, titulo:"Plantilla" });
});

router.get("/productos", (req, res) => {
    res.render("productos");
})

router.get("/carrito", (req, res) => {
    res.render("carrito");
})

router.get("/contacto", (req, res) => {
    res.render("contacto");
})


module.exports = router;
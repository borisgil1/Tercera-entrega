const socket = io();

socket.emit("mensaje", "Hola mundo desde el cliente papá");
socket.on("saludo", (data) => {
    console.log(data);
})

socket.on("products", (data) => {
    const listaProducto = document.getElementById("lista-productos");
    listaProducto.innerHTML = "";
    data.forEach(product => {
        listaProducto.innerHTML += `<li>${product.title}</li>`
    })
})
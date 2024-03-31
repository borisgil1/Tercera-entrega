const socket = io();

socket.emit("mensaje", "Hola mundo desde el cliente papá");

socket.on("saludo", (data) => {
    console.log(data);
})

//Escuchamos el evento para mostrar el array productos
socket.on("products", (data) => {
    const listaProducto = document.getElementById("lista-productos");
    listaProducto.innerHTML = "";
    data.forEach(product => {
        const cardHTML = `
        <div class="col-xl-4 col-md-4 col-sm-4 mb-4">
        <div class="card text-center card-height">
            <h2 class="mb-2">${product.title}</h2>
            <p>${product.description}</p>
            <p>Precio: ${product.price}</p>
            <button>Comprar</button>
        </div>
    </div>
    `;
        listaProducto.innerHTML += cardHTML; // Agregamos la card al contenedor
    });
});
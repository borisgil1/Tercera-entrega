const socket = io();

//Escuchamos el evento para renderizar los productos
socket.on("products", (data) => {
    const listaProducto = document.getElementById("lista-productos");
    listaProducto.innerHTML = "";
    data.forEach(product => {
        const card = `
        <div class="col-xl-4 col-md-4 col-sm-4 mb-4">
        <div class="card text-center card-height">
            <h2 class="mb-2">${product.title}</h2>
            <p>id: ${product.id}</p>
            <p>${product.description}</p>
            <p>Precio: ${product.price}</p>
            <button class="btn-delete" data-id="${product.id}">Eliminar</button>
        </div>
    </div>
    `;
        listaProducto.innerHTML += card;

       // Agrear evento al boton 
       const buttons = document.querySelectorAll("#lista-productos button");
        buttons.forEach(button => {
            button.addEventListener("click", () => {
                const productId = button.getAttribute("data-id");
                eliminarProducto(productId );
            });
        });
    });
});

//Eliminar producto
eliminarProducto = (id) => {
    socket.emit("deleteProduct", id);
}

//Agregar producto
document.getElementById("btnEnviar").addEventlistener("click", () => {
    agregarProducto();
})

//Agg producto
agregarProducto = () => {
    const producto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true"

    }
    socket.emit("agregarProdcuto", producto)
}
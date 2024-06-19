//Cliente

const socket = io();
let user;
const chatBox = document.getElementById("chatBox");



// Escuchar evento para renderizar productos
socket.on("products", (products) => {
    const listaProductos = document.getElementById("lista-productos");
    listaProductos.innerHTML = "";
    products.forEach((product) => {
        // Crear la tarjeta del producto
        const card = document.createElement("div");
        card.classList.add("col-xl-4", "col-md-4", "col-sm-6", "mb-4");

        card.innerHTML = `
            <div class="card text-center h-100">
                <div class="card-header bg-primary text-white">
                    <h5 class="card-title">${product.title}</h5>
                </div>
                <div class="card-body">
                    <img src="${product.img}" class="card-img-top" alt="${product.title}">
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">Precio: $${product.price.toFixed(2)}</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-danger btn-delete" data-id="${product._id}">Eliminar</button>
                </div>
            </div>
        `;

        listaProductos.appendChild(card);

        // Agregar evento al botón de eliminar producto
        const buttons = card.querySelectorAll(".btn-delete");
        buttons.forEach((button) => {
            button.addEventListener("click", () => {
                const pid = button.getAttribute("data-id");
                deleteProduct(pid);
            });
        });
    });
});

// Evento para eliminar producto
function deleteProduct(pid) {
    socket.emit("deleteProduct", pid);
}

// Evento para agregar producto
document.getElementById("btnEnviar").addEventListener("click", addProduct);

function addProduct() {
    const productForm = document.getElementById("productForm");
    const product = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        price: document.getElementById("price").value,
        img: document.getElementById("img").value,
        code: document.getElementById("code").value,
        stock: document.getElementById("stock").value,
        category: document.getElementById("category").value,
        status: document.getElementById("status").value === "true",
    };
    socket.emit("addProduct", product);
    productForm.reset();
}

class UserDTO {
    constructor(first_name, last_name, role, cart, age) {
        this.Nombre = first_name;
        this.Apellido = last_name;
        this.Rol = role;
        this.Carrito = cart;
        this.Edad = age;
    }
}

module.exports = UserDTO;
const sumaLinea = document.getElementById("suma");
const restaLinea = document.getElementById("resta");
const productoLinea = document.getElementById("producto");
const divisionLinea = document.getElementById("division");
const restoLinea = document.getElementById("resto");


var a = 12;
var b = 5;

let suma = a+b;
let resta = a-b;
let producto = a*b;
let division = a/b;
let resto = a%b;


document.addEventListener("DOMContentLoaded", () => {

sumaLinea.textContent = `Suma: ${suma}`;
restaLinea.textContent = `Resta: ${resta}`;
productoLinea.textContent = `Producto: ${producto}`;
divisionLinea.textContent = `Division: ${division}`;
restoLinea.textContent = `Resto: ${resto}`;

})

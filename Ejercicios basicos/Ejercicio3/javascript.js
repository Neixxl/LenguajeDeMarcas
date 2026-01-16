var edad = 3;
const resultado = document.getElementById("parrafojs");


document.addEventListener("DOMContentLoaded", () => {


    if (edad >= 18) {
        resultado.textContent = `${edad} es mayor de edad`;
        resultado.classList.add("mayor");
        resultado.classList.remove("menor")
    }
    else {
        resultado.textContent = `${edad} no es mayor de edad`;
        resultado.classList.add("menor");
        resultado.classList.remove("mayor")
    }

})

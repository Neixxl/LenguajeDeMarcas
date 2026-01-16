const resultado = document.getElementById("parrafojs");
var mes = 5;
var mesName = "";

document.addEventListener("DOMContentLoaded", () => {
    switch (mes) {
        case 1: mesName = "Enero"; break;
        case 2: mesName = "Febrero"; break;
        case 3: mesName = "Marzo"; break;
        case 4: mesName = "Abril"; break;
        case 5: mesName = "Mayo"; break;
        case 6: mesName = "Junio"; break;
        case 7: mesName = "Julio"; break;
        case 8: mesName = "Agosto"; break;
        case 9: mesName = "Septiembre"; break;
        case 10: mesName = "Octubre"; break;
        case 11: mesName = "Noviembre"; break;
        case 12: mesName = "Diciembre"; break;
        default:
            mesName = "[Error] mes invalido";
    }

    resultado.textContent = `Estamos a ${mesName}`;

})

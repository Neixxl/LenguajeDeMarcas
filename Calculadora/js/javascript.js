
// === BOTONES ===
const CE = document.getElementById("CE");
const C = document.getElementById("C");
const DEL = document.getElementById("DEL");
const igual = document.getElementById("igual");
const punto = document.getElementById("punto");
const resultado = document.getElementById("resultado");
const numero = document.querySelectorAll(".numero");
const operador = document.querySelectorAll(".operator");

// === PANTALLA ===
const pantalla = document.getElementById("pantalla");
let span = pantalla.querySelector("span");

// === CALCULOS ===
let numeros = [];
let opEstado = 1;
const operaciones = ["suma", "resta", "divi", "multi"];
let operadorActual = null;

document.addEventListener("DOMContentLoaded", () => {

    if (DEL) {      // === DEL ===
        DEL.addEventListener("click", () => {
            numeros[opEstado] = numeros[opEstado].slice(0, -1);
            pantalla.textContent = numeros[opEstado];
        });
    }

    if (CE) {      // === CE ===    
        CE.addEventListener("click", () => {
            pantalla.textContent = 0;
            numeros = [];
            opEstado = 1;
        });
    }

    if (numero) {  // === NUMEROS ===
        numero.forEach((numero) => {
            numero.addEventListener("click", () => {
                if (numeros[opEstado] === undefined) {
                    numeros[opEstado] = numero.textContent;
                } else if (numeros[opEstado].length < 12) {
                    numeros[opEstado] += numero.textContent;
                }
                pantalla.textContent = numeros[opEstado];
                borrarClase();

                console.log(numeros[opEstado]);
            });
        });
    }

    if (operador) {         // === OPERADORES ===
        operador.forEach((operador) => {
            operador.addEventListener("click", () => {
                if (opEstado === 1) {
                    manejarOperador(operador);
                }
            });
        });
    }

    if (igual) {       // === IGUAL === 
        igual.addEventListener("click", () => {
            if (opEstado >= 2 && numeros[2] !== undefined) {
                calcularOperacion();
            }
        });
    }

});

function manejarOperador(operador) {
    if (operador) {
        pantalla.textContent = 0;
        opEstado = 2;
        operadorActual = operador.id;
        console.log(operador); //DEBUG
        console.log(opEstado); //DEBUG
    }
}

function calcularOperacion() {
    numeros[2] = parseFloat(numeros[2]);
    numeros[1] = parseFloat(numeros[1]);
    borrarClase();
    switch (operadorActual) {
        case "suma":
            numeros[3] = numeros[1] + numeros[2];
            asignarClase(operadorActual);
            break;
        case "resta":
            numeros[3] = numeros[1] - numeros[2];
            asignarClase(operadorActual);
            break;
        case "divi":
            if (numeros[2] === 0) {
                numeros[3] = "ERROR";
                asignarClase(operadorActual);
            } else {
                numeros[3] = numeros[1] / numeros[2];
                asignarClase(operadorActual);
            }
            break;
        case "multi":
            numeros[3] = numeros[1] * numeros[2];
            asignarClase(operadorActual);
            break;
    }
    let resultado = numeros[3].toString();
    if (resultado.length > 12) {
        pantalla.textContent = parseFloat(resultado).toPrecision(8);
    } else {
        pantalla.textContent = resultado;
    }
    console.log("numeros1 " + numeros[1]); //DEBUG
    console.log("numeros2 " + numeros[2]); //DEBUG
    console.log("numeros3 " + numeros[3]); //DEBUG
    numeros = [];
    opEstado = 1;
    operadorActual = null;
}



function asignarClase(operadorActual) {
    pantalla.classList.add(`${operadorActual}Text`); // agrega la clase de la operacion actual
}

function borrarClase() {
    operaciones.forEach(op => {
        pantalla.classList.remove(`${op}Text`);     // quita la clase de la operacion anterior
    });
}


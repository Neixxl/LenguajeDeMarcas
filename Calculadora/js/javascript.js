
// === BOTONES ===
const CE = document.getElementById("CE");
const C = document.getElementById("C");
const DEL = document.getElementById("DEL");
const igual = document.getElementById("igual");
const punto = document.getElementById("punto");
const resultado = document.getElementById("resultado");
const numero = document.querySelectorAll(".numero");
const operador = document.querySelectorAll(".operator");
const inverso = document.getElementById("1/x");
const cuadrado = document.getElementById("x2");
const raiz = document.getElementById("raiz");

// === PANTALLA ===
const pantalla = document.getElementById("pantalla");
// let span = pantalla.querySelector("span");

// === CALCULOS ===
let numeros = [];
let opEstado = 1;
const operaciones = ["suma", "resta", "divi", "multi", "inver", "cuadrado", "raiz"];
let operadorActual = null;

document.addEventListener("DOMContentLoaded", () => {

    if (DEL) {      // === DEL ===
        DEL.addEventListener("click", () => {
            retroceder();
        });
    }

    if (CE) {      // === CE ===    
        CE.addEventListener("click", () => {
            borrarEntrada();
        });
    }

    if (C) {       // === C ===
        C.addEventListener("click", () => {
            borrarTodo();
        });
    }

    if (numero) {  // === NUMEROS ===
        numero.forEach((btn) => {
            btn.addEventListener("click", () => {
                mostrarNumeroPantalla(btn.textContent);
            });
        });
    }

    if (punto) {   // === PUNTO ===
        punto.addEventListener("click", () => {
            mostrarPuntoPantalla();
        });
    }

    if (operador) {         // === OPERADORES ===
        operador.forEach((btn) => {
            btn.addEventListener("click", () => {
                manejarOperador(btn);
            });
        });
    }

    if (inverso) {      // === 1/x ===
        inverso.addEventListener("click", () => {
             operacionInmediata("inver");
        });
    }

    if (cuadrado) {     // === x2 ===
        cuadrado.addEventListener("click", () => {
            operacionInmediata("cuadrado");
        });
    }

    if (raiz) {         // === RAIZ ===
        raiz.addEventListener("click", () => {
            operacionInmediata("raiz");
        });
    }

    if (igual) {       // === IGUAL === 
        igual.addEventListener("click", () => {
            calcularOperacion();
        });
    }

});

// === FUNCIONES ===

function deshabilitarPunto(){
    punto.classList.add("disabled");
}

function habilitarPunto(){
    punto.classList.remove("disabled");
}

function actualizarPantalla() {
    let valor = numeros[opEstado];
    if (valor === undefined) return;
    
    let resultadoStr = valor.toString();
    if (resultadoStr.length > 12) {
        pantalla.textContent = parseFloat(resultadoStr).toPrecision(8);
    } else {
        pantalla.textContent = resultadoStr;
    }
}

function mostrarNumeroPantalla(num) {
    if (numeros[opEstado] === undefined) {
        numeros[opEstado] = num;
    } else if (numeros[opEstado].length < 12) {
        numeros[opEstado] += num;
    }
    pantalla.textContent = numeros[opEstado];
    pantallaColorNormal();
    console.log(numeros[opEstado]);
}

function mostrarPuntoPantalla() {
    if (numeros[opEstado] === undefined) {
        numeros[opEstado] = "0.";
        deshabilitarPunto();
    } else if (!numeros[opEstado].includes(".")) {
        numeros[opEstado] += ".";
        deshabilitarPunto();
    }
    pantalla.textContent = numeros[opEstado];
}

function manejarOperador(operadorBtn) {
    if (operadorBtn) {
        if (opEstado === 1) {
             pantalla.textContent = 0;
             opEstado = 2;
             operadorActual = operadorBtn.id;
             console.log(operadorBtn); //DEBUG
             console.log(opEstado); //DEBUG
             habilitarPunto();
        }
    }
}

function calcularOperacion() {
    if (opEstado >= 2 && numeros[2] !== undefined) {
        numeros[2] = parseFloat(numeros[2]);
        numeros[1] = parseFloat(numeros[1]);
        pantallaColorNormal();
        
        switch (operadorActual) {
            case "suma":
                numeros[3] = numeros[1] + numeros[2];
                aplicarColorResultado("suma");
                break;
            case "resta":
                numeros[3] = numeros[1] - numeros[2];
                aplicarColorResultado("resta");
                break;
            case "divi":
                if (numeros[2] === 0) {
                    numeros[3] = "ERROR";
                    aplicarColorResultado("divi");
                } else {
                    numeros[3] = numeros[1] / numeros[2];
                    aplicarColorResultado("divi");
                }
                break;
            case "multi":
                numeros[3] = numeros[1] * numeros[2];
                aplicarColorResultado("multi");
                break;
        }
        
        if (numeros[3] === "ERROR") {
             pantalla.textContent = "ERROR";
        } else {
             let resultado = numeros[3];
             let resultadoStr = resultado.toString();
             if (resultadoStr.length > 12) {
                pantalla.textContent = parseFloat(resultadoStr).toPrecision(8);
             } else {
                pantalla.textContent = resultadoStr;
             }
        }

        console.log("numeros1 " + numeros[1]); //DEBUG
        console.log("numeros2 " + numeros[2]); //DEBUG
        console.log("numeros3 " + numeros[3]); //DEBUG
        numeros = [];
        opEstado = 1;
        operadorActual = null;
        habilitarPunto();
    }
}

function pantallaColorNormal() {
    operaciones.forEach(op => {
        pantalla.classList.remove(`${op}Text`);
    });
}

function borrarEntrada() {
     numeros[opEstado] = undefined;
     pantalla.textContent = 0;
     pantallaColorNormal();
     habilitarPunto();
}

function borrarTodo() {
    pantalla.textContent = 0;
    numeros = [];
    opEstado = 1;
    pantallaColorNormal();
    habilitarPunto();
}

function retroceder() {
    if (numeros[opEstado]) {
        if (numeros[opEstado].slice(-1) === ".") {
            habilitarPunto();
        }
        numeros[opEstado] = numeros[opEstado].slice(0, -1);
        if (numeros[opEstado] === "") {
             pantalla.textContent = 0;
             numeros[opEstado] = undefined;
        } else {
             pantalla.textContent = numeros[opEstado];
        }
    }
}

function operacionInmediata(operacion) {
     if (numeros[opEstado] !== undefined) {
        let val = parseFloat(numeros[opEstado]);
        let res;
        switch(operacion) {
            case "inver":
                res = 1 / val;
                break;
            case "cuadrado":
                res = Math.pow(val, 2);
                break;
            case "raiz":
                res = Math.sqrt(val);
                break;
        }
        numeros[opEstado] = res;
        actualizarPantalla();
        pantallaColorNormal();
        aplicarColorResultado(operacion);
     }
}

function aplicarColorResultado(operador) {
    pantalla.classList.add(`${operador}Text`);
}

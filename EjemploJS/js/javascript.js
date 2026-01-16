// =============================
//  Ejemplos de JavaScript
// =============================

// Obtengo los elementos de la web necesarios a partir del DOM

const btnVariables = document.getElementById("btnVariables");
const resultadoDiv = document.getElementById("resultadoVariables");

const btnCondicionales = document.getElementById("btnCondicionales");
const resultadoCondicionales = document.getElementById("resultadoCondicionales");

const btnFunciones = document.getElementById("btnFunciones");
const resultadoFunciones = document.getElementById("resultadoFunciones");

const resultadoEventos = document.getElementById("resultadoEventos");

const btnArrays = document.getElementById("btnArrays");
const salida = document.getElementById("resultadoArrays");

const btnTratamientoErrores = document.getElementById("btnTratamientoErrores");

const btnCambiarContenido = document.getElementById("btnCambiarContenido");
const btnCambiarEstilos = document.getElementById("btnCambiarEstilos");
const btnCrearElemento = document.getElementById("btnCrearElemento");
const btnEliminarElemento = document.getElementById("btnEliminarElemento");
const btnCambiarAtributo = document.getElementById("btnCambiarAtributo");
const btnLeerFormulario = document.getElementById("btnLeerFormulario");
const btnRecorrer = document.getElementById("btnRecorrer");
const btnAnimar1 = document.getElementById("btnAnimar1");
const btnAnimar2 = document.getElementById("btnAnimar2");
const btnAnimar3 = document.getElementById("btnAnimar3");

// Variables necesarias

let cantidadelementoslista = 1;
let imagenmostrada = 1;

// *******************
// ** Funcionalidad **
// *******************

/*
    El evento DOMContentLoaded se dispara cuando el navegador ha terminado de cargar y procesar completamente el HTML, antes de que se carguen imágenes, estilos u otros recursos externos.
    Es decir, el DOM ya está construido y listo para ser manipulado con JavaScript.
    Es aquí, y únicamente aquí, donde vamos a dar toda la funcionalidad con respecto a evectos a nuestros elementos.

    Lo que no es obligatorio es hacer todas las búsquedas de elementos (getElementById, querySelector, etc.) dentro de este evento. Va a depender del contexto y del flujo de nuestra app.
    En resumen:
        Si nuestro script JS se ejecuta antes de que el DOM esté listo → Sí.
        Si nuestro script JS está al final del <body> → No hace falta. (Este es nuestro caso)
        Si usamos frameworks como React/Vue → Tampoco tiene sentido, porque ellos controlan el DOM.
*/

document.addEventListener("DOMContentLoaded", () => {

    /*
        hljs.highlightAll(); es una función propia de Highlight.js, la biblioteca que se usa para colorear código en páginas web.
    
        hljs.highlightAll(); busca automáticamente todos los elementos <pre><code> de la página y les aplica coloreado de sintaxis según el lenguaje que detecte de forma automática o el que le indiquemos con clases (por ejemplo class="language-javascript").
    */
    hljs.highlightAll();

    if (btnVariables) {
        btnVariables.addEventListener("click", () => {

            // Variables numéricas
            var numero1 = 10;
            let numero2 = 7;
            const constante = 5;

            // Operaciones numéricas
            let suma = numero1 + numero2;
            let resta = numero1 - numero2;
            let multiplicacion = numero1 * numero2;
            let division = numero1 / numero2;

            // Variables tipo String
            let saludo = "Hola";
            let nombre = "Carlos";

            // Operaciones con Strings
            let mensajeCompleto = saludo + " " + nombre;
            let longitud = mensajeCompleto.length;
            let mayus = mensajeCompleto.toUpperCase();
            let minus = mensajeCompleto.toLowerCase();

            // Mostramos el resultado en la consola de resultados
            resultadoDiv.textContent = `
Operaciones numéricas:
Suma: ${suma}
Resta: ${resta}
Multiplicación: ${multiplicacion}
División: ${division}
------------------------------
Operaciones con Strings:
Mensaje completo: ${mensajeCompleto}
Longitud: ${longitud}
En mayúsculas: ${mayus}
En minúsculas: ${minus}
            `.trimStart();
        });
    }

    if (btnCondicionales) {
        btnCondicionales.addEventListener("click", () => {

            // Condicional if/else
            let edad = 20;
            let mensaje;
            if (edad >= 18) {
                mensaje = "Es mayor de edad";
            } else {
                mensaje = "Es menor de edad";
            }

            // Bucle for
            let numeros = "";
            for (let i = 1; i <= 5; i++) {
                numeros += i + " ";
            }

            // Condicional switch
            let dia = 3;
            let nombreDia;
            switch(dia) {
                case 1:
                    nombreDia = "Lunes";
                    break;
                case 2:
                    nombreDia = "Martes";
                    break;
                case 3:
                    nombreDia = "Miércoles";
                    break;
                case 4:
                    nombreDia = "Jueves";
                    break;
                case 5:
                    nombreDia = "Viernes";
                    break;
                default:
                    nombreDia = "Fin de semana";
                    break;
            }

            // Mostramos el resultado en la consola de resultados
            resultadoCondicionales.textContent = `
Condicional if/else:
${mensaje}

Bucle for (1 al 5):
${numeros}

Switch:
Día de la semana: ${nombreDia}
            `.trimStart();
        });
    }

    if (btnFunciones) {
        btnFunciones.addEventListener("click", () => {

            /**
             * @brief Suma dos números y devuelve el resultado.
             *
             * Esta función recibe dos valores numéricos, los suma
             * y retorna el resultado final.
             *
             * @param {number} a Primer número a sumar.
             * @param {number} b Segundo número a sumar.
             * @return {number} Resultado de la suma de a y b.
             */
            function sumar(a, b) {
                return a + b;
            }

            /**
             * @brief Muestra un saludo en la consola.
             *
             * Función sin valor de retorno que imprime un mensaje
             * de saludo utilizando el nombre proporcionado.
             *
             * @param {string} nombre Nombre de la persona a saludar.
             * @return {void}
             */
            function saludar(nombre) {
                console.log("Hola " + nombre + "!");
            }

            // Uso de las funciones
            let resultado = sumar(10, 5);
            // Capturamos la salida de saludar en la consola simulada
            let mensaje = "Hola Carlos!";

            resultadoFunciones.textContent = `
Función que devuelve un valor:
Resultado de sumar(10,5): ${resultado}

Función que no devuelve valor:
${mensaje}
            `.trimStart();
        });
    }

    /**
     * @brief Imprime un mensaje en la consola simulada de la página.
     *
     * Esta función añade el texto proporcionado al elemento de salida `resultadoEventos`,
     * agregando un salto de línea al final para que los mensajes aparezcan uno debajo del otro,
     * simulando el comportamiento de una consola.
     *
     * @param {string} mensaje El mensaje que se desea mostrar en la consola simulada.
     */
    function imprimirConsola(mensaje) {
        resultadoEventos.textContent += mensaje + "\n";
    }

    // Evento click
    const btnClick = document.getElementById("botonClick");
    if (btnClick) {
        btnClick.addEventListener("click", () => {
            imprimirConsola("Se hizo click en el botón");
        });
    }

    // Evento mouseover
    const cuadroHover = document.getElementById("cuadroHover");
    if (cuadroHover) {
        cuadroHover.addEventListener("mouseover", () => {
            imprimirConsola("Has pasado sobre el cuadro.");
        });
    }

    // Evento input
    const inputTexto = document.getElementById("inputTexto");
    if (inputTexto) {
        inputTexto.addEventListener("input", () => {
            imprimirConsola("Texto ingresado: " + inputTexto.value);
        });
    }

    if (btnArrays) {
        btnArrays.addEventListener("click", () => {

            // Declaración de un array
            let numeros = [1, 2, 3, 4, 5];

            // Operaciones básicas
            numeros.push(6);
            numeros.pop();
            numeros.unshift(0);
            numeros.shift();

            // Operaciones adicionales
            let parte = numeros.slice(1, 4);
            numeros.splice(2, 1, 99);
            let dobles = numeros.map(n => n * 2);
            let mayoresQue3 = numeros.filter(n => n > 3);
            let suma = numeros.reduce((acc, n) => acc + n, 0);
            let encontrado = numeros.find(n => n > 3);
            let existe = numeros.includes(2);
            numeros.sort((a,b) => a-b);
            numeros.reverse();
            let texto = numeros.join(", ");
            let combinado = numeros.concat([10,11,12]);

            // Mostrar resultados
            resultadoArrays.textContent = `
Operaciones con Arrays
----------------------
Array original modificado: ${numeros}
Parte del array: ${parte}
Dobles: ${dobles}
Mayores que 3: ${mayoresQue3}
Suma: ${suma}
Encontrado (>3): ${encontrado}
Existe el 2: ${existe}
Texto: ${texto}
Combinado: ${combinado}
            `.trimStart();
        });
    }

    if (btnTratamientoErrores) {
        btnTratamientoErrores.addEventListener("click", () => {
            const salida = document.getElementById("resultadoTratamientoErrores");
            let resultado = "";

            // Ejemplo 1: Error al intentar ejecutar código inválido
            try {
                resultado += "Intentando ejecutar código inválido...\n";
                let x = variablenodefinida + 5; // Esto lanzará ReferenceError
            } catch (error) {
                resultado += "Error detectado: " + error.name + " - " + error.message + "\n\n";
            }

            // Ejemplo 2: Lanzar un error personalizado con throw
            try {
                let nombre = "";
                resultado += "Verificando nombre...\n";                

                if (nombre.trim() === "") {
                    throw new Error("El nombre no puede estar vacío");
                }

                resultado += "Nombre correcto.\n";
            } catch (error) {
                resultado += "Error personalizado: " + error.message + "\n\n";
            }

            // Ejemplo 3: Bloque finally
            try {
                resultado += "Probando bloque try/finally...\n";
            } catch (error) {
                resultado += "Error: " + error.message + "\n\n";
            } finally {
                resultado += "El bloque finally siempre se ejecuta.\n";
            }

            salida.textContent = resultado.trimStart();
        });
    }

    // ==================================================================
    //  Funcionalidad completa de la parte de manipulación del DOM
    // ==================================================================

    // Funcionalidad para cambiar el contenido del texto
    if(btnCambiarContenido){
        btnCambiarContenido.addEventListener("click", () => {
            const texto = document.getElementById("textoCambiarContenido");
            texto.textContent = "El contenido ha sido modificado dinámicamente.";
        });
    }

    // Funcionalidad para cambiar una clase CSS
    if(btnCambiarEstilos){
        btnCambiarEstilos.addEventListener("click", () => {
            const caja = document.getElementById("caja-estilos");

            // Alterna entre dos estilos. Si la clase existe, la remueve; si no existe, la añade
            caja.classList.toggle("estilo2");
            // También podemos reemplazar todas las clases existentes y dejar la indicada
            // Pero no funcionaría para alternar
            // caja.className = "estilo2";
        });
    }

    // Funcionalidad para crear y eliminar elementos
    if(btnCrearElemento){
        btnCrearElemento.addEventListener("click", () => {
            const listadinamica = document.getElementById("lista-dinamica");

            const nuevo = document.createElement("li");
            nuevo.textContent = "Elemento de la lista número " + ++cantidadelementoslista;

            listadinamica.appendChild(nuevo);
        });
    }
    
    if(btnEliminarElemento){
        btnEliminarElemento.addEventListener("click", () => {
            const listadinamica = document.getElementById("lista-dinamica");

            if (listadinamica.lastElementChild) {
                listadinamica.removeChild(listadinamica.lastElementChild);
                cantidadelementoslista--;
            }
        });
    }

    // Funcionalidad para cambiar un atributo de un elemento (Ruta de una imagen)
    if (btnCambiarAtributo) {
        btnCambiarAtributo.addEventListener("click", () => {
            const imagencambiar = document.getElementById("imagen-cambiar");

            const imagenes = [
                "../imagenes/logo_HTML5.svg",
                "../imagenes/logo_CSS3.svg",
                "../imagenes/logo_JavaScript.svg"
            ];
            
            imagencambiar.src = imagenes[imagenmostrada];

            imagenmostrada = (imagenmostrada + 1) % 3;
        });
    }

    // Funcionalidad para leer el contenido de un input
    if(btnLeerFormulario){
        btnLeerFormulario.addEventListener("click", () => {
            const nombre = document.getElementById("input-nombre").value;

            const salida = document.getElementById("resultado-formulario");

            if (nombre.trim() === "") {
                salida.textContent = "Error. Rellena todos los campos";
            } else {
                salida.textContent = `Hola ${nombre}`;
            }
        });
    }

    // Funcionalidad para recorrer elementos del DOM (Elementos de una lista)
    if(btnRecorrer){
        btnRecorrer.addEventListener("click", () => {
            const items = document.querySelectorAll(".lista-recorrer li");
            const salida = document.getElementById("salida-recorrer");

            let texto = "Elementos encontrados:\n";

            items.forEach((item, index) => {
                texto += `• (${index + 1}) ${item.textContent}\n`;
            });

            salida.textContent = texto;
        });
    }

    // Funcionalidad para aplicar una animación
    if(btnAnimar1){
        btnAnimar1.addEventListener("click", () => {
            const cuadroAnimar = document.getElementById("cuadroAnimar");

            // Resetea animación si ya fue ejecutada
            cuadroAnimar.style.animation = "none";
            // offsetWidth es una propiedad del DOM que devuelve el ancho visible de un elemento en píxeles.
            // Leer esta propiedad hace que el navegador recalcule el estilo y la disposición de ese elemento, es decir, fuerza un reflow/repaint.
            void cuadroAnimar.offsetWidth;
            // Aplica la animación
            // Durante 1,2 segundos
            // Función de temporización (ease-in-out). La animación acelera al inicio y desacelera al final, haciendo el movimiento más natural.
            // Propiedad animation-fill-mode = forwards. Hace que el elemento se quede en el estado final de la animación una vez que termina, en lugar de volver a la posición inicial.
            cuadroAnimar.style.animation = "moverDerechaRebote 1.2s ease-in-out forwards";
        });
    }
    
    if(btnAnimar2){
        btnAnimar2.addEventListener("click", () => {
            const cuadroAnimar = document.getElementById("cuadroAnimar");

            cuadroAnimar.style.animation = "none";
            void cuadroAnimar.offsetWidth;
            cuadroAnimar.style.animation = "moverYRotar 1.2s ease-in-out forwards";
        });
    }

    if(btnAnimar3){
        btnAnimar3.addEventListener("click", () => {
            const cuadroAnimar = document.getElementById("cuadroAnimar");

            cuadroAnimar.style.animation = "none";
            void cuadroAnimar.offsetWidth;
            cuadroAnimar.style.animation = "escalarCoche 1.2s ease-in-out forwards";
        });
    }
});
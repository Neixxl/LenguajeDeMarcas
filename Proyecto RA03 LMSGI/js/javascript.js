

const opciones = ['🪨', '📄', '✂️', '🦎', '🖖'];


document.addEventListener('DOMContentLoaded', () => {

    //--------------------------------OPCIONES USER--------------------------------------
    const botonPapel = document.getElementById('papel');
    const botonPiedra = document.getElementById('piedra');
    const botonTijera = document.getElementById('tijera');
    const botonLagarto = document.getElementById('lagarto');
    const botonSpock = document.getElementById('spock');
    //-----------------------------------------------------------------------------------
    const jugadaJugador = document.getElementById('jugada-jugador').querySelector('.placeholder');
    const jugadaCPU = document.getElementById('jugada-cpu').querySelector('.placeholder');
    const resultadoJugada = document.getElementById('resultado-jugada');
    const contadorPuntosJugador = document.getElementById('victorias');
    const contadorPuntosCPU = document.getElementById('derrotas');
    const contadorEmpates = document.getElementById('empates');

    const textoJugadaDefault = "❓";
    let eleccionUsuario = "";

    //-----------------------------VARIABLES ESTADISTICAS--------------------------------
    let victorias = 0;
    let derrotas = 0;
    let empates = 0;

    //-----------------------------LLAMADA FUNCIONES-------------------------------------
    try {
        inicializarJuego();
        inicializarTooltips();
    } catch (error) {
        console.error("Error al inicializar el juego:", error);
    }
    //-----------------------------------------------------------------------------------
    const botonesJuego = [ // Mapeo cada boton con su opcion en un array de objetos 
        { boton: botonPiedra, opcion: opciones[0] },
        { boton: botonPapel, opcion: opciones[1] },
        { boton: botonTijera, opcion: opciones[2] },
        { boton: botonLagarto, opcion: opciones[3] },
        { boton: botonSpock, opcion: opciones[4] }
    ];

    botonesJuego.forEach(elemento => { // Recorro el array de objetos y saco los botones y ya ahi le añado el event listener.
        elemento.boton.addEventListener('click', () => {
            try {
                jugar(elemento.opcion);
            } catch (error) {
                console.error("Error durante la jugada:", error);
            }
        });
    });

    const botonReiniciar = document.getElementById('reiniciar-juego');
    const botonReglas = document.getElementById('mostrar-reglas');

    if (botonReiniciar) botonReiniciar.addEventListener('click', resetearJuego);
    if (botonReglas) botonReglas.addEventListener('click', mostrarReglas);

    //-----------------------------------------------------------------------------------

    /**
    * @brief Inicializa el juego configurando los elementos, estados y eventos necesarios.
    *
    * Esta función prepara todo lo necesario para que el juego pueda comenzar,
    * incluyendo la configuración de la interfaz, los valores iniciales de los
    * jugadores y la vinculación de eventos a los controles.
    *
    * @return {void} No devuelve ningún valor.
    */
    function inicializarJuego() {
        victorias = 0;
        derrotas = 0;
        empates = 0;

        actualizarContadores();
        reiniciarDisplays();
    }
    //-----------------------------------------------------------------------------------

    /**
    * @brief Ejecuta una ronda del juego con la elección del usuario.
    *
    * Esta función realiza los siguientes pasos:
    * 1. Reinicia los displays del juego.
    * 2. Genera la elección de la CPU de forma aleatoria.
    * 3. Muestra la elección del usuario y de la CPU con animaciones.
    * 4. Calcula el resultado de la ronda.
    * 5. Muestra el resultado y actualiza los contadores correspondientes.
    *
    * @param {string} eleccionUsuario La elección realizada por el usuario (por ejemplo: "piedra", "papel", "tijera"...).
    * @return {void} No devuelve ningún valor.
    */
    function jugar(eleccionUsuario) {
        reiniciarDisplays();

        const eleccionCPU = obtenerEleccionCPU();
        const resultado = calcularResultadoJugada(eleccionUsuario, eleccionCPU);

        // Muestro las jugadas con un pequeno retraso para el efecto de batalla
        mostrarEleccion(document.getElementById('jugada-jugador'), eleccionUsuario, "JUGADOR");

        setTimeout(() => {
            mostrarEleccion(document.getElementById('jugada-cpu'), eleccionCPU, "CPU");

            setTimeout(() => {
                // Actualizo marcadores segun resultado
                if (resultado === "victoria") victorias++;
                else if (resultado === "derrota") derrotas++;
                else empates++;

                mostrarResultadoJugada(resultado, eleccionUsuario, eleccionCPU);
                actualizarContadores();
            }, 500);
        }, 500);
    }
    //-----------------------------------------------------------------------------------

    /**
    * @brief Genera aleatoriamente la elección de la CPU.
    *
    * Esta función selecciona una opción al azar entre las disponibles y la devuelve.
    *
    * @return {string} La elección de la CPU (por ejemplo: "piedra", "papel" o "tijera"...).
    */
    function obtenerEleccionCPU() {
        return opciones[Math.floor(Math.random() * opciones.length)];
    }
    //-----------------------------------------------------------------------------------

    /**
    * @brief Muestra la elección de un jugador (jugador humano o CPU) en un display con icono y texto.
    *
    * Esta función limpia el contenido del display, aplica la clase
    * para animación/estilo y agrega los elementos que representan
    * la jugada seleccionada (emoji y texto) del jugador indicado.
    *
    * @param {HTMLElement} display El contenedor donde se mostrará la elección.
    * @param {string} eleccion La clave de la elección (por ejemplo: "piedra", "papel", "tijera"...).
    * @param {string} jugador Nombre del jugador que realizó la elección (por ejemplo: "JUGADOR" o "CPU").
    * @return {void} No devuelve ningún valor.
    */
    function mostrarEleccion(display, eleccion, jugador) {
        display.innerHTML = ""; // Limpio el placeholder
        display.classList.add('active');

        const icono = document.createElement('span');
        icono.textContent = eleccion;
        icono.classList.add('icono-jugada-grande');

        const nombreJugada = document.createElement('p');
        nombreJugada.classList.add('texto-jugada');

        // Busco el nombre de la jugada segun el icono
        const nombres = ["Piedra", "Papel", "Tijera", "Lagarto", "Spock"];
        nombreJugada.textContent = nombres[opciones.indexOf(eleccion)];

        display.appendChild(icono);
        display.appendChild(nombreJugada);
    }
    //-----------------------------------------------------------------------------------

    /**
    * @brief Reinicia los displays del juego a su estado inicial.
    *
    * Esta función restablece el contenido de los displays del usuario y de la CPU,
    * elimina cualquier clase de animación activa y restablece el mensaje de resultado
    * al texto predeterminado "¡Batalla!".
    *
    * @return {void} No devuelve ningún valor.
    */
    function reiniciarDisplays() {
        const displayJugador = document.getElementById('jugada-jugador');
        const displayCPU = document.getElementById('jugada-cpu');

        displayJugador.classList.remove('active');
        displayCPU.classList.remove('active');

        displayJugador.innerHTML = '<span class="placeholder">' + textoJugadaDefault + '</span>';
        displayCPU.innerHTML = '<span class="placeholder">' + textoJugadaDefault + '</span>';

        // El header vuelve a su estado por defecto
        const tituloEstadisticas = document.getElementById('titulo-estadisticas');
        if (tituloEstadisticas) {
            tituloEstadisticas.textContent = "¡Batalla!";
            tituloEstadisticas.className = "mensaje-resultado"; // Limpio clases de ganador/perdedor
        }

        resultadoJugada.textContent = "";
        resultadoJugada.className = "mensaje-resultado";
    }
    //-----------------------------------------------------------------------------------

    /**
    * @brief Calcula el resultado de una ronda entre el usuario y la CPU.
    *
    * Esta función compara la elección del usuario con la elección de la CPU
    * y determina si la ronda termina en victoria, derrota o empate según
    * las reglas del juego.
    *
    * @param {string} usuario La elección del usuario (por ejemplo: "piedra", "papel", "tijera"...).
    * @param {string} cpu La elección de la CPU (por ejemplo: "piedra", "papel", "tijera"...).
    * @return {string} El resultado de la ronda: "victoria", "derrota" o "empate".
    */
    function calcularResultadoJugada(usuario, cpu) {
        if (usuario === cpu) {
            return "empate";
        } else if (
            (usuario === "🪨" && (cpu === "✂️" || cpu === "🦎"))
            || (usuario === "📄" && (cpu === "🪨" || cpu === "🖖"))
            || (usuario === "✂️" && (cpu === "📄" || cpu === "🦎"))
            || (usuario === "🦎" && (cpu === "📄" || cpu === "🖖"))
            || (usuario === "🖖" && (cpu === "🪨" || cpu === "✂️"))
        ) {
            return "victoria";
        } else {
            return "derrota";
        }
    }
    //-----------------------------------------------------------------------------------

    /**
    * @brief Muestra el resultado de una ronda en la interfaz del juego.
    *
    * Esta función actualiza el mensaje de resultado según si el usuario ganó,
    * perdió o empató, aplica la clase correspondiente para estilos y
    * actualiza los contadores de victorias, derrotas o empates.
    *
    * @param {string} resultado Resultado de la ronda: "victoria", "derrota" o "empate".
    * @param {string} usuario Elección del usuario (por ejemplo: "piedra", "papel", "tijera"...).
    * @param {string} cpu Elección de la CPU (por ejemplo: "piedra", "papel", "tijera"...).
    * @return {void} No devuelve ningún valor.
    */
    function mostrarResultadoJugada(resultado, usuario, cpu) {
        const tituloEstadisticas = document.getElementById('titulo-estadisticas');

        if (tituloEstadisticas) {
            // Aplico la clase de color al titulo segun el resultado
            if (resultado === "victoria") tituloEstadisticas.className = "mensaje-resultado ganador";
            else if (resultado === "derrota") tituloEstadisticas.className = "mensaje-resultado perdedor";
            else tituloEstadisticas.className = "mensaje-resultado empate";

            let descripcion = "";

            if (resultado === "empate") {
                tituloEstadisticas.textContent = "Empate!";
            } else {
                // Saco la frase descriptiva segun quien gane
                let vencedor = (resultado === "victoria") ? usuario : cpu;
                let perdedor = (resultado === "victoria") ? cpu : usuario;

                if (vencedor === "✂️" && perdedor === "📄") descripcion = "Tijera corta Papel";
                else if (vencedor === "📄" && perdedor === "🪨") descripcion = "Papel cubre Piedra";
                else if (vencedor === "🪨" && perdedor === "🦎") descripcion = "Piedra aplasta Lagarto";
                else if (vencedor === "🦎" && perdedor === "🖖") descripcion = "Lagarto envenena Spock";
                else if (vencedor === "🖖" && perdedor === "✂️") descripcion = "Spock destroza Tijera";
                else if (vencedor === "✂️" && perdedor === "🦎") descripcion = "Tijera decapita Lagarto";
                else if (vencedor === "🦎" && perdedor === "📄") descripcion = "Lagarto se come Papel";
                else if (vencedor === "📄" && perdedor === "🖖") descripcion = "Papel desaprueba Spock";
                else if (vencedor === "🖖" && perdedor === "🪨") descripcion = "Spock vaporiza Piedra";
                else if (vencedor === "🪨" && perdedor === "✂️") descripcion = "Piedra aplasta Tijera";

                if (resultado === "victoria") {
                    tituloEstadisticas.textContent = "¡Has ganado! " + descripcion;
                } else {
                    tituloEstadisticas.textContent = "¡Has perdido! " + descripcion;
                }
            }

            // Aplico la clase de color tambien al mensaje de resultado
            if (resultado === "victoria") resultadoJugada.className = "mensaje-resultado ganador";
            else if (resultado === "derrota") resultadoJugada.className = "mensaje-resultado perdedor";
            else resultadoJugada.className = "mensaje-resultado empate";
        }
    }
    //-----------------------------------------------------------------------------------

    /**
    * @brief Actualiza los contadores de victorias, derrotas y empates en la interfaz.
    *
    * Esta función refleja los valores actuales de las variables globales
    * victorias, derrotas y empates en los elementos del DOM correspondientes.
    *
    * @return {void} No devuelve ningún valor.
    */
    function actualizarContadores() {
        contadorPuntosJugador.textContent = victorias;
        contadorPuntosCPU.textContent = derrotas;
        contadorEmpates.textContent = empates;
    }
    //-----------------------------------------------------------------------------------

    /**
    * @brief Inicializa los tooltips de los botones de elección.
    *
    * Esta función recorre todos los botones de elección, obtiene la jugada
    * asociada a cada uno y configura el atributo `title` para mostrar
    * un tooltip indicando qué opciones vence esa jugada.
    *
    * @return {void} No devuelve ningún valor.
    */
    function inicializarTooltips() {
        const piedra = document.getElementById('piedra');
        const papel = document.getElementById('papel');
        const tijera = document.getElementById('tijera');
        const lagarto = document.getElementById('lagarto');
        const spock = document.getElementById('spock');

        if (piedra) piedra.title = "Piedra vence a: Tijera y Lagarto";
        if (papel) papel.title = "Papel vence a: Piedra y Spock";
        if (tijera) tijera.title = "Tijera vence a: Papel y Lagarto";
        if (lagarto) lagarto.title = "Lagarto vence a: Papel y Spock";
        if (spock) spock.title = "Spock vence a: Piedra y Tijera";
    }

    // ----------------- OPTATIVO ----------------------- //
    /**
     * @brief Muestra las reglas detalladas del juego por la consola.
     * @details Imprime una lista de todas las jugadas y sus interacciones de victoria/derrota para consulta del usuario.
     * @return {void}
     */
    function mostrarReglas() {
        console.clear();
        console.log("--- REGLAS DEL JUEGO ---");
        console.log("1. Tijera corta Papel");
        console.log("2. Papel cubre Piedra");
        console.log("3. Piedra aplasta Lagarto");
        console.log("4. Lagarto envenena Spock");
        console.log("5. Spock destroza Tijera");
        console.log("6. Tijera decapita Lagarto");
        console.log("7. Lagarto se come Papel");
        console.log("8. Papel desaprueba Spock");
        console.log("9. Spock vaporiza Piedra");
        console.log("10. Piedra aplast Tijera");
    }
    /**
     * @brief Reinicia todos los elementos del juego a su estado original.
     * @details Llama a inicializarJuego para resetear marcadores y limpia cualquier mensaje o jugada mostrada actualmente en el panel de batalla.
     * @return {void}
     */
    function resetearJuego() {
        inicializarJuego();
        console.log("Juego reiniciado correctamente.");
    }

    /**
     * @brief Maneja las entradas de teclado para permitir jugar y usar funciones especiales.
     * @details Escucha las pulsaciones de las teclas 1-5 para realizar las jugadas correspondientes, la tecla 'r' para reiniciar el juego y la tecla 's' para mostrar las reglas.
     * @param {KeyboardEvent} event - El evento de teclado capturado.
     * @return {void}
     */
    document.addEventListener('keydown', (event) => {
        try {
            switch (event.key) {
                case '1': jugar(opciones[0]); break;
                case '2': jugar(opciones[1]); break;
                case '3': jugar(opciones[2]); break;
                case '4': jugar(opciones[3]); break;
                case '5': jugar(opciones[4]); break;
                case 'r': case 'R': resetearJuego(); break;
                case 's': case 'S': mostrarReglas(); break;
            }
        } catch (error) {
            console.error("Error en evento de teclado:", error);
        }
    });


})

setTimeout(() => {
    const contenedor = document.querySelector('main');
    if (contenedor) {
        contenedor.style.opacity = '1';
    }
}, 100);

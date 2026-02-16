

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

    //-----------------------------LLAMADA FUNCIONES-------------------------------------
    inicializarJuego();
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
            eleccionUsuario = elemento.opcion;
            console.log("Seleccion:", eleccionUsuario);
            jugar(eleccionUsuario);
        });
    });
    //-----------------------------------------------------------------------------------





    function inicializarJuego() {
        jugadaJugador.textContent = textoJugadaDefault;
        jugadaCPU.textContent = textoJugadaDefault;

        contadorPuntosCPU.textContent = 0;
        contadorPuntosJugador.textContent = 0;
        contadorEmpates.textContent = 0;
    }
    function jugar(eleccionUsuario) {

        let eleccionCPU = obtenerEleccionCPU();

        jugadaJugador.textContent = eleccionUsuario;
        jugadaCPU.textContent = eleccionCPU;

        let resultado = calcularResultadoJugada(eleccionUsuario, eleccionCPU);
        mostrarResultadoJugada(resultado, eleccionUsuario, eleccionCPU);
        actualizarContadores(resultado);




    }
    function obtenerEleccionCPU() {
        let eleccion = opciones[Math.floor(Math.random() * opciones.length)];
        return eleccion;
    }
    function mostrarEleccion(display, eleccion, jugador) { }
    function reiniciarDisplays() { }
    function calcularResultadoJugada(usuario, cpu) {

        let resultado = "TODAVIANO"

        if (usuario === cpu) { resultado = "Empate" }
        else if (
            (usuario === "🪨" && (cpu === "✂️" || cpu === "🦎"))
            || (usuario === "📄" && (cpu === "🪨" || cpu === "🖖"))
            || (usuario === "✂️" && (cpu === "📄" || cpu === "🦎"))
            || (usuario === "🦎" && (cpu === "📄" || cpu === "🖖"))
            || (usuario === "🖖" && (cpu === "🪨" || cpu === "✂️"))
        ) {
            resultado = "VICTORIA"
        } else { resultado = "DERROTA" };
        console.log(resultado); //DEBUG
        return resultado;
    }
    function mostrarResultadoJugada(resultado, usuario, cpu) { }
    function actualizarContadores() { }
    function inicializarTooltips() { }

    // ----------------- OPTATIVO ----------------------- //
    function mostrarReglas() { }
    function resetearJuego() { }

    document.addEventListener('keydown', (event) => { });


})

setTimeout(() => {
    const contenedor = document.querySelector('main');
    if (contenedor) {
        contenedor.style.opacity = '1';
    }
}, 100);

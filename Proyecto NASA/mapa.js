/* ========================================
   NASA ORBIT MAP — LÓGICA MATEMÁTICA Y CANVAS
   ========================================
   Este archivo incluye:
   1. Resolución de Ecuaciones de Kepler.
   2. Fetch a la API de JPL SBDB.
   3. Renderizado de HTML5 Canvas.
   ======================================== */

// --- 1. Variables de Estado ---
const canvas = document.getElementById('orbit-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
let width = window.innerWidth - 280; // Restando el sidebar
let height = window.innerHeight - 33; // Restando el topbar

// Ajustar canvas para altas resoluciones (Retina)
function resizeCanvas() {
    width = window.innerWidth - 280;
    if (width < 0) width = window.innerWidth;
    height = window.innerHeight - 33;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform matrix
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Escala y Tiempo
let zoom = 150; // Pixeles por 1 UA (Unidad Astronómica)
let timeScale = 1; // 1 = 1 día real por frame. 0 = Pausado.
let currentJD = getJulianDate(new Date()); // Fecha actual en Día Juliano

// Array de cuerpos celestes
let celestialBodies = [];

// --- 2. Utilidades Matemáticas ---
const DEG_TO_RAD = Math.PI / 180;

// Obtener el Día Juliano (JD) desde una fecha
function getJulianDate(date) {
    return (date.getTime() / 86400000) + 2440587.5;
}

// Resolver Ecuación de Kepler: M = E - e*sin(E)
// Usamos el método de Newton-Raphson para encontrar la Anomalía Excéntrica (E)
function solveKepler(M, e) {
    let E = M;
    for (let i = 0; i < 15; i++) {
        let delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        E -= delta;
        if (Math.abs(delta) < 1e-6) break;
    }
    return E;
}

// --- 3. Clase CieloCelestial ---
class CelestialBody {
    constructor(name, type, color, elements) {
        this.name = name;
        this.type = type; // 'planet', 'asteroid'
        this.color = color;

        // Elementos Orbitales (Epoch J2000 usualmente, o la dada por el JPL)
        this.a = parseFloat(elements.a); // Semieje mayor (UA)
        this.e = parseFloat(elements.e); // Excentricidad
        this.i = parseFloat(elements.i) * DEG_TO_RAD; // Inclinación
        this.om = parseFloat(elements.om) * DEG_TO_RAD; // Longitud del nodo ascendente
        this.w = parseFloat(elements.w) * DEG_TO_RAD; // Argumento del periastro
        this.M_epoch = parseFloat(elements.ma) * DEG_TO_RAD; // Anomalía media en el epoch
        this.n = parseFloat(elements.n) * DEG_TO_RAD; // Movimiento medio (rad/dia)
        this.epoch = parseFloat(elements.epoch_jd); // Fecha del epoch (JD)

        // Calcular la órbita estática (100 puntos) para dibujarla rápido
        this.orbitPath = this.calculateOrbitPath();
    }

    // Calcular posición X, Y para un día Juliano específico
    getPositionAt(jd) {
        // 1. Anomalía media actual
        let M = this.M_epoch + this.n * (jd - this.epoch);
        M = M % (2 * Math.PI); // Normalizar entre 0 y 2PI

        // 2. Resolver Kepler
        const E = solveKepler(M, this.e);

        // 3. Posición en el plano orbital (2D)
        const Px = this.a * (Math.cos(E) - this.e);
        const Py = this.a * Math.sqrt(1 - this.e * this.e) * Math.sin(E);

        // 4. Rotar al plano eclíptico (3D proyectado a 2D vista superior)
        // Ignoraremos el eje Z para una vista top-down 2D sencilla.
        const cos_w = Math.cos(this.w), sin_w = Math.sin(this.w);
        const cos_om = Math.cos(this.om), sin_om = Math.sin(this.om);
        const cos_i = Math.cos(this.i);

        const x = Px * (cos_w * cos_om - sin_w * sin_om * cos_i) + Py * (-sin_w * cos_om - cos_w * sin_om * cos_i);
        const y = Px * (cos_w * sin_om + sin_w * cos_om * cos_i) + Py * (-sin_w * sin_om + cos_w * cos_om * cos_i);

        return { x, y };
    }

    // Precalcular los puntos de la elipse entera (para dibujarla)
    calculateOrbitPath() {
        const path = [];
        const steps = 180;
        for (let j = 0; j <= steps; j++) {
            const E = (j / steps) * 2 * Math.PI;
            const Px = this.a * (Math.cos(E) - this.e);
            const Py = this.a * Math.sqrt(1 - this.e * this.e) * Math.sin(E);

            const cos_w = Math.cos(this.w), sin_w = Math.sin(this.w);
            const cos_om = Math.cos(this.om), sin_om = Math.sin(this.om);
            const cos_i = Math.cos(this.i);

            const x = Px * (cos_w * cos_om - sin_w * sin_om * cos_i) + Py * (-sin_w * cos_om - cos_w * sin_om * cos_i);
            const y = Px * (cos_w * sin_om + sin_w * cos_om * cos_i) + Py * (-sin_w * sin_om + cos_w * cos_om * cos_i);

            path.push({ x, y });
        }
        return path;
    }
}

// --- 4. Datos Estáticos Base ---
// Añadir la Tierra y Marte fijos para tener referencia gráfica.
// Estos datos son aproximados del epoch J2000.
function addBasePlanets() {
    celestialBodies.push(new CelestialBody('Tierra', 'planet', '#66ccff', {
        a: 1.00000011, e: 0.01671022, i: 0.00005, om: -11.26064, w: 102.94719,
        ma: 100.46435, n: 0.985609, epoch_jd: 2451545.0 // J2000
    }));
    celestialBodies.push(new CelestialBody('Marte', 'planet', '#ff6633', {
        a: 1.52366231, e: 0.09341233, i: 1.85061, om: 49.57854, w: 336.04084,
        ma: 355.45332, n: 0.524020, epoch_jd: 2451545.0
    }));
    celestialBodies.push(new CelestialBody('Mercurio', 'planet', '#999999', {
        a: 0.387098, e: 0.205630, i: 7.005, om: 48.331, w: 29.124,
        ma: 174.796, n: 4.092317, epoch_jd: 2451545.0
    }));
    celestialBodies.push(new CelestialBody('Venus', 'planet', '#e6e6fa', {
        a: 0.723332, e: 0.006773, i: 3.394, om: 76.680, w: 54.884,
        ma: 50.115, n: 1.602130, epoch_jd: 2451545.0
    }));
    celestialBodies.push(new CelestialBody('Jupiter', 'planet', '#cca37a', {
        a: 5.2038, e: 0.0489, i: 1.304, om: 100.46, w: 273.86,
        ma: 20.020, n: 0.083085, epoch_jd: 2451545.0
    }));
    updateUIList();
}

// --- 5. Lógica de API (NASA SBDB JPL) ---
async function fetchAsteroid() {
    const input = document.getElementById('asteroid-name').value.trim();
    if (!input) return;

    const btn = document.getElementById('btn-add-asteroid');
    const status = document.getElementById('sbdb-status');

    btn.disabled = true;
    btn.textContent = 'Buscando...';
    status.textContent = 'Consultando api.nasa.gov/ssd...';

    try {
        // La API del JPL soporta CORS nativamente
        let url = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${encodeURIComponent(input)}&orbit=1`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.code && data.code !== '200') {
            status.textContent = 'Error: No encontrado.';
        } else {
            // Parsear datos de la respuesta
            const objOrbit = data.orbit.elements;

            // La API de SBDB nos da un array de objetos con "name" y "value".
            // Lo pasamos a un diccionario fácil de usar.
            const elems = {};
            objOrbit.forEach(el => elems[el.name] = el.value);

            // Añadir al mapa
            const name = data.object.fullname;
            celestialBodies.push(new CelestialBody(name, 'asteroid', '#ff4444', {
                a: elems.a,
                e: elems.e,
                i: elems.i,
                om: elems.node,
                w: elems.peri,
                ma: elems.ma,
                n: elems.n,
                epoch_jd: data.orbit.epoch
            }));

            status.textContent = '¡Añadido con éxito!';
            document.getElementById('asteroid-name').value = '';
            updateUIList();
        }
    } catch (e) {
        status.textContent = `Error: ${e.message}`;
    }

    btn.disabled = false;
    btn.textContent = '> Buscar y Dibujar';
}

function updateUIList() {
    const list = document.getElementById('body-list');
    list.innerHTML = celestialBodies.map(b => `
        <div class="body-item">
            <div class="body-color" style="background:${b.color}"></div>
            <span class="body-name">${b.name}</span>
            <span class="body-type">${b.type}</span>
        </div>
    `).join('');
}


// --- 6. Renderizado General ---
function draw() {
    // 1. Limpiar fondo (espacio profundo)
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Centro = El Sol
    const cx = width / 2;
    const cy = height / 2;

    // Dibujar el Sol
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffcc00';
    ctx.fill();
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffcc00';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Actualizar UI de fecha actual
    const dt = new Date((currentJD - 2440587.5) * 86400000);
    document.getElementById('current-date-ui').textContent = dt.toISOString().split('T')[0];

    // Iterar todos los cuerpos
    for (const body of celestialBodies) {
        // A. Dibujar el camino (órbita estática)
        ctx.beginPath();
        for (let j = 0; j < body.orbitPath.length; j++) {
            const pt = body.orbitPath[j];
            // Matemática clásica: X va a la derecha, pero para nosotros Y va hacia arriba en matemáticas,
            // mientras que en canvas Y va hacia abajo. Invertimos Y.
            const px = cx + (pt.x * zoom);
            const py = cy - (pt.y * zoom);

            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = body.type === 'planet' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 68, 68, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // B. Dibujar posición actual
        const pos = body.getPositionAt(currentJD);
        const px = cx + (pos.x * zoom);
        const py = cy - (pos.y * zoom);

        ctx.beginPath();
        ctx.arc(px, py, body.type === 'planet' ? 4 : 2, 0, 2 * Math.PI);
        ctx.fillStyle = body.color;
        ctx.fill();

        // C. Dibujar el nombre (solo planetas o asteroides añadidos recientemente)
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '10px "JetBrains Mono"';
        ctx.fillText(body.name, px + 6, py + 4);
    }

    // Avanzar el tiempo
    currentJD += timeScale;

    // Siguiente frame
    requestAnimationFrame(draw);
}

// Inicializar
if (window.location.protocol === 'file:') {
    document.getElementById('local-warning').style.display = 'block';
}
addBasePlanets();
draw();

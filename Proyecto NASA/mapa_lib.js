/* ========================================
   NASA ORBIT MAP — USANDO ORB.JS (2D)
   ======================================== */

// --- 1. Variables de Estado ---
const canvas = document.getElementById('orbit-canvas');
const ctx = canvas.getContext('2d', { alpha: false });
let width = window.innerWidth - 280;
let height = window.innerHeight - 33;

function resizeCanvas() {
    width = window.innerWidth - 280;
    if (width < 0) width = window.innerWidth;
    height = window.innerHeight - 33;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Escala y Tiempo
let zoom = 150; 
let timeScale = 1; 
let currentJD = (new Date().getTime() / 86400000) + 2440587.5;

let celestialBodies = [];

// --- 2. Clase Cuerpo Celeste (Wrapper de orb.js) ---
class CelestialBody {
    constructor(name, type, color, elements) {
        this.name = name;
        this.type = type;
        this.color = color;
        this.id = 'body-' + Math.random().toString(36).substr(2, 9);

        // Creamos el objeto Kepler de Orb.js directamente con los datos de la API
        this.orbit = new Orb.Kepler({
            semi_major_axis: parseFloat(elements.a),
            eccentricity: parseFloat(elements.e),
            inclination: parseFloat(elements.i),
            longitude_of_ascending_node: parseFloat(elements.om),
            argument_of_periapsis: parseFloat(elements.w),
            mean_anomaly: parseFloat(elements.ma),
            epoch: parseFloat(elements.epoch_jd)
        });

        // Precalcular camino de la órbita
        this.orbitPath = this.calculateOrbitPath();
    }

    // Usamos Orb.js para obtener la posición exacta
    getPositionAt(jd) {
        // Orb.js xyz() requiere un objeto Date
        const date = new Date((jd - 2440587.5) * 86400000);
        const pos = this.orbit.xyz(date);
        return { x: pos.x, y: pos.y };
    }

    calculateOrbitPath() {
        const path = [];
        const steps = 180;
        for (let j = 0; j <= steps; j++) {
            const M = (j / steps) * 360; 
            const tempOrbit = new Orb.Kepler({
                ...this.orbit.orbital_elements,
                mean_anomaly: M
            });
            const date = new Date((this.orbit.epoch - 2440587.5) * 86400000);
            const pos = tempOrbit.xyz(date);
            path.push({ x: pos.x, y: pos.y });
        }
        return path;
    }
}

// --- 3. Datos Base y API ---
function addBasePlanets() {
    celestialBodies.push(new CelestialBody('Tierra', 'planet', '#66ccff', {
        a: 1.00000011, e: 0.01671022, i: 0.00005, om: -11.26, w: 102.94, ma: 100.46, epoch_jd: 2451545.0
    }));
    celestialBodies.push(new CelestialBody('Marte', 'planet', '#ff6633', {
        a: 1.52366231, e: 0.09341233, i: 1.85, om: 49.57, w: 336.04, ma: 355.45, epoch_jd: 2451545.0
    }));
    updateUIList();
}

async function fetchAsteroid() {
    const input = document.getElementById('asteroid-name').value.trim();
    if (!input) return;

    const btn = document.getElementById('btn-add-asteroid');
    const status = document.getElementById('sbdb-status');
    const useProxyCheck = document.getElementById('use-proxy')?.checked;

    btn.disabled = true;
    btn.textContent = 'Buscando...';
    status.textContent = 'Consultando NASA JPL...';

    // Lista de proxies para intentar en secuencia si falla el anterior
    const proxies = [
        (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        (url) => `https://api.cors.lol/?url=${encodeURIComponent(url)}`,
        (url) => `https://thingproxy.freeboard.io/fetch/${url}`
    ];

    let data = null;
    let url = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${encodeURIComponent(input)}&orbit=1`;

    try {
        if (!useProxyCheck) {
            // Intento directo primero
            try {
                const res = await fetch(url);
                data = await res.json();
            } catch (e) {
                console.warn("Fetch directo falló, intentando proxies...");
            }
        }

        // Si no hay datos, probamos los proxies
        if (!data) {
            for (let i = 0; i < proxies.length; i++) {
                try {
                    const proxyUrl = proxies[i](url);
                    console.log(`Intentando proxy ${i + 1}: ${proxyUrl}`);
                    const res = await fetch(proxyUrl);
                    const raw = await res.json();
                    
                    // Manejar diferentes formatos de proxy
                    if (raw.contents) { // AllOrigins
                        data = JSON.parse(raw.contents);
                    } else if (raw.data) { // Otros
                        data = raw.data;
                    } else {
                        data = raw;
                    }
                    
                    if (data) break;
                } catch (e) {
                    console.error(`Proxy ${i + 1} falló:`, e);
                }
            }
        }

        if (!data) throw new Error("No se pudo conectar con la API de la NASA tras varios intentos.");

        if (data.code && data.code !== '200') {
            status.textContent = 'Error: Objeto no encontrado.';
        } else {
            const objOrbit = data.orbit.elements;
            const elems = {};
            objOrbit.forEach(el => elems[el.name] = el.value);

            const name = data.object.fullname;
            celestialBodies.push(new CelestialBody(name, 'asteroid', '#ff4444', {
                a: elems.a,
                e: elems.e,
                i: elems.i,
                om: elems.node,
                w: elems.peri,
                ma: elems.ma,
                epoch_jd: data.orbit.epoch
            }));

            status.textContent = '¡Añadido con éxito!';
            document.getElementById('asteroid-name').value = '';
            updateUIList();
        }
    } catch (e) {
        status.textContent = `Error: Tiempo de espera agotado. Prueba de nuevo o usa una extensión de CORS.`;
        console.error("Fetch final error:", e);
    }
    btn.disabled = false;
    btn.textContent = '> Buscar y Dibujar';
}

function removeBody(id) {
    celestialBodies = celestialBodies.filter(b => b.id !== id);
    updateUIList();
}

function updateUIList() {
    const list = document.getElementById('body-list');
    list.innerHTML = celestialBodies.map(b => `
        <div class="body-item">
            <div style="display:flex; align-items:center; gap:8px; flex:1">
                <div class="body-color" style="background:${b.color}"></div>
                <div style="display:flex; flex-direction:column">
                    <span class="body-name">${b.name}</span>
                    <span class="body-type">${b.type}</span>
                </div>
            </div>
            ${b.type === 'asteroid' ? `<button class="btn-delete" onclick="removeBody('${b.id}')">&times;</button>` : ''}
        </div>
    `).join('');
}

// --- 4. Renderizado ---
function draw() {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Dibujar Sol
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffcc00';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffcc00';
    ctx.fill();
    ctx.shadowBlur = 0;

    const dt = new Date((currentJD - 2440587.5) * 86400000);
    document.getElementById('current-date-ui').textContent = dt.toISOString().split('T')[0];

    for (const body of celestialBodies) {
        // Órbita
        ctx.beginPath();
        for (let j = 0; j < body.orbitPath.length; j++) {
            const pt = body.orbitPath[j];
            const px = cx + (pt.x * zoom);
            const py = cy - (pt.y * zoom);
            if (j === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = body.type === 'planet' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 68, 68, 0.25)';
        ctx.stroke();

        // Posición actual
        const pos = body.getPositionAt(currentJD);
        const px = cx + (pos.x * zoom);
        const py = cy - (pos.y * zoom);

        ctx.beginPath();
        ctx.arc(px, py, body.type === 'planet' ? 4 : 2, 0, 2 * Math.PI);
        ctx.fillStyle = body.color;
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '10px "JetBrains Mono"';
        ctx.fillText(body.name, px + 6, py + 4);
    }

    currentJD += timeScale;
    requestAnimationFrame(draw);
}

// Inicializar cuando la librería esté lista
window.addEventListener('load', () => {
    addBasePlanets();
    draw();
});


/* ========================================
   NASA API DEBUG PAGE - JAVASCRIPT
   ========================================
   Contiene toda la logica para interactuar
   con los 17 endpoints de la API de NASA.
   ======================================== */

// -- Config ------------------------------
const API_BASE = 'https://api.nasa.gov';
const IMAGE_LIBRARY_BASE = 'https://images-api.nasa.gov';
const SSD_API_BASE = 'https://ssd-api.jpl.nasa.gov';
const EXOPLANET_BASE = 'https://exoplanetarchive.ipac.caltech.edu';
const EONET_BASE = 'https://eonet.gsfc.nasa.gov/api/v3';
const TLE_BASE = 'https://celestrak.org/NORAD/elements/gp.php';

// -- State -------------------------------
let currentEndpoint = 'apod';
let requestHistory = [];
let currentResultView = 'preview'; // 'preview' | 'json' | 'history'

// -- Endpoint Definitions ----------------
// Cada endpoint define: su formulario HTML, como construir la URL,
// y como renderizar el preview de los resultados.
const ENDPOINTS = {
    apod: {
        name: 'APOD',
        fullName: 'Astronomy Picture of the Day',
        icon: '',
        badge: 'GET',
        path: '/planetary/apod',
        description: 'La imagen astronomica del dia. Cada dia una imagen o video diferente de nuestro fascinante universo con una breve explicacion.',
        buildForm: () => `
            <div class="form-group">
                <label>Modo</label>
                <select id="apod-mode" onchange="toggleApodMode()">
                    <option value="today">Hoy</option>
                    <option value="date">Fecha especifica</option>
                    <option value="range">Rango de fechas</option>
                    <option value="random">Aleatorio</option>
                </select>
            </div>
            <div id="apod-date-field" class="form-group" style="display:none">
                <label>Fecha <span class="optional">(YYYY-MM-DD)</span></label>
                <input type="date" id="apod-date" value="${getTodayStr()}">
            </div>
            <div id="apod-range-fields" class="form-row" style="display:none">
                <div class="form-group">
                    <label>Desde</label>
                    <input type="date" id="apod-start" value="${getWeekAgoStr()}">
                </div>
                <div class="form-group">
                    <label>Hasta</label>
                    <input type="date" id="apod-end" value="${getTodayStr()}">
                </div>
            </div>
            <div id="apod-count-field" class="form-group" style="display:none">
                <label>Cantidad <span class="optional">(1-100)</span></label>
                <input type="number" id="apod-count" value="5" min="1" max="100">
            </div>
            <div class="form-group">
                <label>Incluir explicacion</label>
                <select id="apod-thumbs">
                    <option value="true">Si</option>
                    <option value="false">No</option>
                </select>
            </div>
        `,
        buildUrl: () => {
            const key = getApiKey();
            const mode = val('apod-mode');
            let params = `api_key=${key}&thumbs=true`;
            if (mode === 'date') params += `&date=${val('apod-date')}`;
            if (mode === 'range') params += `&start_date=${val('apod-start')}&end_date=${val('apod-end')}`;
            if (mode === 'random') params += `&count=${val('apod-count')}`;
            return `${API_BASE}/planetary/apod?${params}`;
        },
        renderPreview: (data) => {
            const items = Array.isArray(data) ? data : [data];
            return `
                <div class="preview-grid">
                    ${items.map(item => `
                        <div class="preview-card">
                            ${item.media_type === 'image' ? `
                                <img src="${item.url}" alt="${item.title}" onclick="window.open('${item.url}', '_blank')">
                            ` : `
                                <div style="height:150px;display:flex;align-items:center;justify-content:center;background:#222;font-size:0.7rem;color:var(--text-dim);text-align:center;padding:10px">
                                    [Video: ${item.title}]
                                </div>
                            `}
                            <div class="caption">
                                <strong>${item.title || 'Sin titulo'}</strong>
                                <span>${item.date}</span>
                                <p style="font-size:0.65rem;color:var(--text-dim);margin-top:4px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">${item.explanation || ''}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },

    mars: {
        name: 'Mars Rover',
        fullName: 'Mars Rover Photos',
        icon: '',
        badge: 'GET',
        path: '/mars-photos/api/v1',
        description: 'Recupera datos de imagen recopilados por los rovers Curiosity, Opportunity, Spirit y Perseverance de la NASA en Marte.',
        buildForm: () => `
            <div class="form-group">
                <label>Rover</label>
                <select id="mars-rover">
                    <option value="curiosity">Curiosity</option>
                    <option value="perseverance">Perseverance</option>
                    <option value="opportunity">Opportunity</option>
                    <option value="spirit">Spirit</option>
                </select>
            </div>
            <div class="form-group">
                <label>Modo de fecha</label>
                <select id="mars-mode" onchange="toggleMarsMode()">
                    <option value="sol">Sol (dia marciano)</option>
                    <option value="earth_date">Fecha terrestre</option>
                </select>
            </div>
            <div id="mars-sol-field" class="form-group">
                <label>Sol <span class="optional">(0 - actual)</span></label>
                <input type="number" id="mars-sol" value="1000" min="0">
            </div>
            <div id="mars-date-field" class="form-group" style="display:none">
                <label>Fecha</label>
                <input type="date" id="mars-date" value="2015-06-03">
            </div>
            <div class="form-group">
                <label>Camara <span class="optional">(vacio = todas)</span></label>
                <select id="mars-camera">
                    <option value="">Todas</option>
                    <option value="FHAZ">FHAZ - Front Hazard Avoidance Camera</option>
                    <option value="RHAZ">RHAZ - Rear Hazard Avoidance Camera</option>
                    <option value="MAST">MAST - Mast Camera</option>
                    <option value="CHEMCAM">CHEMCAM - Chemistry and Camera Complex</option>
                    <option value="MAHLI">MAHLI - Mars Hand Lens Imager</option>
                    <option value="MARDI">MARDI - Mars Descent Imager</option>
                </select>
            </div>
        `,
        buildUrl: () => {
            const key = getApiKey();
            const rover = val('mars-rover');
            const mode = val('mars-mode');
            let params = `api_key=${key}`;
            if (mode === 'sol') params += `&sol=${val('mars-sol')}`;
            else params += `&earth_date=${val('mars-date')}`;
            if (val('mars-camera')) params += `&camera=${val('mars-camera')}`;
            return `${API_BASE}/mars-photos/api/v1/rovers/${rover}/photos?${params}`;
        },
        renderPreview: (data) => {
            const photos = data.photos || [];
            if (photos.length === 0) return '<p>No se encontraron fotos para estos parametros.</p>';
            return `
                <p style="margin-bottom:8px;font-size:0.75rem;color:var(--text-dim)">${photos.length} fotos encontradas</p>
                <div class="preview-grid">
                    ${photos.slice(0, 50).map(p => `
                        <div class="preview-card">
                            <img src="${p.img_src}" alt="Mars photo" onclick="window.open('${p.img_src}', '_blank')">
                            <div class="caption">
                                <strong>ID: ${p.id}</strong>
                                <span>Rover: ${p.rover.name} - Cam: ${p.camera.name}</span>
                                <span>Sol: ${p.sol} (${p.earth_date})</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },

    epic: {
        name: 'EPIC',
        fullName: 'Earth Polychromatic Imaging Camera',
        icon: '',
        badge: 'GET',
        path: '/EPIC/api',
        description: 'Imagenes diarias de la Tierra desde el satelite DSCOVR a 1.5 millones de km de distancia.',
        buildForm: () => `
            <div class="form-group">
                <label>Tipo de imagen</label>
                <select id="epic-quality">
                    <option value="natural">Natural (Color real)</option>
                    <option value="enhanced">Enhanced (Color mejorado)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Fecha <span class="optional">(vacio = ultima disponible)</span></label>
                <input type="date" id="epic-date" placeholder="Añada fecha">
            </div>
        `,
        buildUrl: () => {
            const key = getApiKey();
            const quality = val('epic-quality');
            const date = val('epic-date');
            let path = `api/${quality}`;
            if (date) path += `/date/${date}`;
            return `${API_BASE}/EPIC/${path}?api_key=${key}`;
        },
        renderPreview: (data) => {
            if (!Array.isArray(data) || data.length === 0) return '<p>No se encontraron imagenes para esta fecha.</p>';
            const quality = val('epic-quality');
            return `
                <div class="preview-grid">
                    ${data.map(item => {
                const d = item.date.split(' ')[0].replace(/-/g, '/');
                const imgUrl = `https://epic.gsfc.nasa.gov/archive/${quality}/${d}/jpg/${item.image}.jpg`;
                return `
                            <div class="preview-card">
                                <img src="${imgUrl}" alt="EPIC Earth" onclick="window.open('${imgUrl}', '_blank')">
                                <div class="caption">
                                    <strong>${item.caption}</strong>
                                    <span>${item.date}</span>
                                    <span>Coords: ${item.centroid_coordinates.lat.toFixed(2)}, ${item.centroid_coordinates.lon.toFixed(2)}</span>
                                </div>
                            </div>
                        `;
            }).join('')}
                </div>
            `;
        }
    },

    imagelib: {
        name: 'Image Library',
        fullName: 'NASA Image and Video Library',
        icon: '',
        badge: 'GET',
        path: '/search',
        description: 'Explora toda la biblioteca de imagenes y videos de la NASA. Busca por cualquier termino (ej: "Apollo", "Jupiter", "Nebula").',
        buildForm: () => `
            <div class="form-group">
                <label>Termino de busqueda</label>
                <input type="text" id="lib-query" value="Jupiter" placeholder="Ej: Orion, Mars, SLS...">
            </div>
            <div class="form-group">
                <label>Tipo de medio</label>
                <select id="lib-media" multiple style="height:50px">
                    <option value="image" selected>Imagen</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                </select>
            </div>
            <div class="form-group">
                <label>Centro <span class="optional">(Ej: JPL, GSFC)</span></label>
                <input type="text" id="lib-center" placeholder="Opcional">
            </div>
        `,
        buildUrl: () => {
            const q = val('lib-query');
            const sel = document.getElementById('lib-media');
            const media = Array.from(sel.selectedOptions).map(o => o.value).join(',');
            let params = `q=${encodeURIComponent(q)}&media_type=${media}`;
            if (val('lib-center')) params += `&center=${val('lib-center')}`;
            return `${IMAGE_LIBRARY_BASE}/search?${params}`;
        },
        renderPreview: (data) => {
            const items = data.collection?.items || [];
            if (items.length === 0) return '<p>No se encontraron resultados.</p>';
            return `
                <p style="margin-bottom:8px;font-size:0.75rem;color:var(--text-dim)">${items.length} resultados encontrados</p>
                <div class="preview-grid">
                    ${items.slice(0, 30).map(item => {
                const d = item.data[0];
                const thumb = item.links?.[0]?.href;
                return `
                            <div class="preview-card">
                                ${thumb ? `<img src="${thumb}" alt="NASA Image" onclick="window.open('${thumb}', '_blank')">` : '<div style="height:150px;background:#222"></div>'}
                                <div class="caption">
                                    <strong>${d.title}</strong>
                                    <span>${d.date_created.split('T')[0]} · ${d.center}</span>
                                    <p style="font-size:0.65rem;color:var(--text-dim);margin-top:4px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${d.description || ''}</p>
                                </div>
                            </div>
                        `;
            }).join('')}
                </div>
            `;
        }
    },

    earth: {
        name: 'Earth',
        fullName: 'Earth Landsat Imagery',
        icon: '',
        badge: 'GET',
        path: '/planetary/earth',
        description: 'Imagenes de satelite Landsat de cualquier punto de la Tierra. Introduce coordenadas y una fecha para obtener una imagen aérea.',
        buildForm: () => `
            <div class="form-group">
                <label>Modo</label>
                <select id="earth-mode">
                    <option value="imagery">Imagen (devuelve foto)</option>
                    <option value="assets">Assets (consulta disponibilidad)</option>
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Latitud</label>
                    <input type="number" id="earth-lat" value="29.9792" step="0.0001">
                </div>
                <div class="form-group">
                    <label>Longitud</label>
                    <input type="number" id="earth-lon" value="31.1342" step="0.0001">
                </div>
            </div>
            <div class="form-group">
                <label>Fecha <span class="optional">(YYYY-MM-DD)</span></label>
                <input type="date" id="earth-date" value="2023-01-01">
            </div>
            <div class="form-group">
                <label>Dimension <span class="optional">(grados, def 0.025)</span></label>
                <input type="number" id="earth-dim" value="0.025" step="0.001">
            </div>
        `,
        buildUrl: () => {
            const key = getApiKey();
            const mode = val('earth-mode');
            const lat = val('earth-lat');
            const lon = val('earth-lon');
            const date = val('earth-date');
            const dim = val('earth-dim');
            return `${API_BASE}/planetary/earth/${mode}?lon=${lon}&lat=${lat}&date=${date}&dim=${dim}&api_key=${key}`;
        },
        renderPreview: (data) => {
            if (data.url) {
                return `
                    <div class="preview-grid">
                        <div class="preview-card" style="grid-column: 1/-1">
                            <img src="${data.url}" alt="Earth imagery" style="height:auto;max-height:500px">
                            <div class="caption">
                                <strong>Landsat Imagery</strong>
                                ID: ${data.id || '-'} · Date: ${data.date || '-'}
                            </div>
                        </div>
                    </div>`;
            }
            if (data.results) {
                return `
                    <p style="margin-bottom:8px;font-size:0.7rem;color:var(--text-dim)">${data.count || data.results.length} assets found</p>
                    <div style="overflow-x:auto">
                    <table class="data-table">
                        <thead><tr><th>Date</th><th>ID</th></tr></thead>
                        <tbody>${data.results.slice(0, 30).map(r => `<tr><td>${r.date}</td><td>${r.id}</td></tr>`).join('')}</tbody>
                    </table></div>`;
            }
            return `<div class="json-viewer">${syntaxHighlight(data)}</div>`;
        }
    },

    neows: {
        name: 'NeoWs',
        fullName: 'Near Earth Object Web Service',
        icon: '',
        badge: 'GET',
        path: '/neo/rest/v1',
        description: 'Informacion sobre asteroides cercanos a la Tierra. Puedes buscar asteroides por fecha, o ver los proximos acercamientos.',
        buildForm: () => `
            <div class="form-group">
                <label>Modo</label>
                <select id="neo-mode">
                    <option value="feed">Feed (Proximos asteroides)</option>
                    <option value="browse">Browse (Todo el catalogo)</option>
                </select>
            </div>
            <div id="neo-feed-fields" class="form-row">
                <div class="form-group">
                    <label>Desde</label>
                    <input type="date" id="neo-start" value="${getTodayStr()}">
                </div>
                <div class="form-group">
                    <label>Hasta <span class="optional">(max 7 dias)</span></label>
                    <input type="date" id="neo-end" value="${getTodayStr()}">
                </div>
            </div>
        `,
        buildUrl: () => {
            const key = getApiKey();
            const mode = val('neo-mode');
            if (mode === 'browse') return `${API_BASE}/neo/rest/v1/neo/browse?api_key=${key}`;
            return `${API_BASE}/neo/rest/v1/feed?start_date=${val('neo-start')}&end_date=${val('neo-end')}&api_key=${key}`;
        },
        renderPreview: (data) => {
            let neos = [];
            if (data.near_earth_objects) {
                Object.keys(data.near_earth_objects).forEach(date => {
                    neos = neos.concat(data.near_earth_objects[date]);
                });
            } else if (data.near_earth_objects_browse) {
                neos = data.near_earth_objects_browse;
            }

            if (neos.length === 0) return '<p>No se encontraron asteroides.</p>';

            return `
                <p style="margin-bottom:8px;font-size:0.75rem;color:var(--text-dim)">${neos.length} asteroides listados</p>
                <div style="overflow-x:auto">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Diametro (m)</th>
                            <th>Peligroso</th>
                            <th>Fecha aprox</th>
                            <th>Distancia (km)</th>
                            <th>Vel (km/h)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${neos.slice(0, 100).map(n => {
                const ca = n.close_approach_data?.[0] || {};
                const diam = n.estimated_diameter?.meters;
                return `
                                <tr>
                                    <td><strong>${n.name}</strong></td>
                                    <td>${diam ? `${diam.estimated_diameter_min.toFixed(0)}-${diam.estimated_diameter_max.toFixed(0)}` : '-'}</td>
                                    <td class="${n.is_potentially_hazardous_asteroid ? 'hazardous-yes' : 'hazardous-no'}">
                                        ${n.is_potentially_hazardous_asteroid ? 'SI' : 'no'}
                                    </td>
                                    <td>${ca.close_approach_date || '-'}</td>
                                    <td>${ca.miss_distance ? Math.round(ca.miss_distance.kilometers).toLocaleString() : '-'}</td>
                                    <td>${ca.relative_velocity ? Math.round(ca.relative_velocity.kilometers_per_hour).toLocaleString() : '-'}</td>
                                </tr>
                            `;
            }).join('')}
                    </tbody>
                </table>
                </div>
            `;
        }
    },

    sbdb: {
        name: 'SBDB',
        fullName: 'Small-Body Database Lookup',
        icon: '',
        badge: 'GET',
        path: '/sbdb.api',
        description: 'Datos detallados de cualquier asteroide o cometa: elementos orbitales, datos fisicos y aproximaciones.',
        buildForm: () => `
            <div class="form-group">
                <label>Nombre o designación</label>
                <input type="text" id="sbdb-query" value="Apophis" placeholder="Ej: Ceres, Halley...">
            </div>
            <div class="form-group">
                <label>Datos a incluir</label>
                <select id="sbdb-extras" multiple style="height:60px">
                    <option value="orbit" selected>Orbita</option>
                    <option value="phys" selected>Fisicos</option>
                    <option value="ca" selected>Aprox</option>
                </select>
            </div>
        `,
        buildUrl: () => {
            const q = val('sbdb-query');
            const sel = document.getElementById('sbdb-extras');
            const extras = Array.from(sel.selectedOptions).map(o => o.value);
            let params = `sstr=${encodeURIComponent(q)}`;
            if (extras.includes('orbit')) params += '&orbit=true';
            if (extras.includes('phys')) params += '&phys=true';
            if (extras.includes('ca')) params += '&ca=true';
            return `${SSD_API_BASE}/sbdb.api?${params}`;
        },
        renderPreview: (data) => {
            if (data.code && data.code !== '200') return `<p>Error: ${data.message || JSON.stringify(data)}</p>`;
            const obj = data.object || {};
            const orbit = data.orbit?.elements || [];
            const phys = data.phys_par || [];
            let html = `<h3 style="margin-bottom:8px;color:var(--cyan)">${obj.fullname || obj.des || 'Objeto'}</h3>`;
            if (obj.kind) html += `<p style="font-size:0.7rem;color:var(--text-dim);margin-bottom:12px">Tipo: ${obj.kind}</p>`;

            if (orbit.length > 0) {
                html += `<div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Parametro</th><th>Valor</th></tr></thead><tbody>
                ${orbit.map(e => `<tr><td><strong>${e.label || e.name}</strong></td><td>${e.value} ${e.units || ''}</td></tr>`).join('')}
                </tbody></table></div>`;
            }
            return html;
        }
    },

    cad: {
        name: 'Close Approach',
        fullName: 'Close Approach Data',
        icon: '',
        badge: 'GET',
        path: '/cad.api',
        description: 'Trayectorias de asteroides que pasaran cerca de planetas.',
        buildForm: () => `
            <div class="form-row">
                <div class="form-group">
                    <label>Desde</label>
                    <input type="date" id="cad-start" value="${getTodayStr()}">
                </div>
                <div class="form-group">
                    <label>Hasta</label>
                    <input type="date" id="cad-end" value="${addDays(getTodayStr(), 30)}">
                </div>
            </div>
            <div class="form-group">
                <label>Cuerpo</label>
                <select id="cad-body">
                    <option value="Earth">Tierra</option>
                    <option value="Moon">Luna</option>
                    <option value="Mars">Marte</option>
                    <option value="Jupiter">Jupiter</option>
                </select>
            </div>
        `,
        buildUrl: () => {
            let params = `date-min=${val('cad-start')}&date-max=${val('cad-end')}&dist-max=0.05`;
            if (val('cad-body') !== 'Earth') params += `&body=${val('cad-body')}`;
            return `${SSD_API_BASE}/cad.api?${params}`;
        },
        renderPreview: (data) => {
            const items = data.data || [];
            if (items.length === 0) return '<p>No se encontraron aproximaciones.</p>';
            return `
                <div style="overflow-x:auto">
                <table class="data-table">
                    <thead><tr>${(data.fields || []).map(f => `<th>${f}</th>`).join('')}</tr></thead>
                    <tbody>${items.slice(0, 50).map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
                </table></div>`;
        }
    },

    fireball: {
        name: 'Fireballs',
        fullName: 'Meteor Impact Data',
        icon: '',
        description: 'Impactos de meteoritos en la atmosfera.',
        buildForm: () => `
            <div class="form-group">
                <label>Desde</label>
                <input type="date" id="fb-start" value="${addDays(getTodayStr(), -365)}">
            </div>
        `,
        buildUrl: () => `${SSD_API_BASE}/fireball.api?date-min=${val('fb-start')}`,
        renderPreview: (data) => {
            const items = data.data || [];
            return `<div style="overflow-x:auto"><table class="data-table">
                <thead><tr>${(data.fields || []).map(f => `<th>${f}</th>`).join('')}</tr></thead>
                <tbody>${items.slice(0, 50).map(row => `<tr>${row.map(c => `<td>${c || '-'}</td>`).join('')}</tr>`).join('')}</tbody>
                </table></div>`;
        }
    },

    exoplanet: {
        name: 'Exoplanets',
        fullName: 'Exoplanet Archive',
        icon: '',
        description: 'Base de datos de exoplanetas confirmados.',
        buildForm: () => `
            <div class="form-group">
                <label>Preset</label>
                <select id="exo-preset" onchange="toggleExoMode()">
                    <option value="top50">Ultimos 50</option>
                    <option value="habitable">Habitables</option>
                    <option value="byname">Por estrella</option>
                    <option value="custom">SQL ADQL</option>
                </select>
            </div>
            <div id="exo-name-field" style="display:none" class="form-group">
                <label>Estrella</label>
                <input type="text" id="exo-star" value="Kepler">
            </div>
            <div id="exo-custom-field" style="display:none" class="form-group">
                <label>Query</label>
                <input type="text" id="exo-query" value="SELECT TOP 50 pl_name FROM ps">
            </div>
        `,
        buildUrl: () => {
            let q = '';
            const preset = val('exo-preset');
            if (preset === 'top50') q = 'SELECT TOP 50 pl_name,hostname,disc_year,sy_dist FROM ps ORDER BY disc_year DESC';
            else if (preset === 'habitable') q = 'SELECT TOP 30 pl_name,hostname,pl_eqt FROM ps WHERE pl_eqt BETWEEN 200 AND 320';
            else if (preset === 'byname') q = `SELECT TOP 50 pl_name,hostname FROM ps WHERE hostname LIKE '%${val('exo-star')}%'`;
            else q = val('exo-query');
            return `${EXOPLANET_BASE}/TAP/sync?query=${encodeURIComponent(q)}&format=json`;
        },
        renderPreview: (data) => {
            const rows = data.data || data.DATA || [];
            if (rows.length === 0) return '<p>Sin resultados.</p>';
            return `<div style="overflow-x:auto"><table class="data-table">
                <tbody>${rows.slice(0, 50).map(row => `<tr>${Object.values(row).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
                </table></div>`;
        }
    },

    sentry: {
        name: 'Sentry',
        fullName: 'NEO Risk assessment',
        icon: '',
        description: 'Prediccion de impactos de asteroides (CNEOS).',
        buildForm: () => `
            <select id="sentry-mode" onchange="toggleSentryMode()">
                <option value="all">Ver todos</option>
                <option value="byname">Por nombre</option>
            </select>
            <div id="sentry-name-field" style="display:none" class="form-group">
                <label>Nombre</label>
                <input type="text" id="sentry-des" value="99942">
            </div>
        `,
        buildUrl: () => {
            if (val('sentry-mode') === 'byname') return `${SSD_API_BASE}/sentry.api?des=${val('sentry-des')}`;
            return `${SSD_API_BASE}/sentry.api`;
        },
        renderPreview: (data) => {
            const items = data.data || [];
            return `<div style="overflow-x:auto"><table class="data-table">
                <tbody>${items.slice(0, 50).map(row => `<tr>${Object.values(row).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
                </table></div>`;
        }
    },

    nhats: {
        name: 'NHATS',
        fullName: 'Human Accessible NEOs',
        icon: '',
        description: 'NEOs accesibles para futuras misiones tripuladas.',
        buildForm: () => `<input type="number" id="nhats-dv" value="12">`,
        buildUrl: () => `${SSD_API_BASE}/nhats.api?dv=${val('nhats-dv')}`,
        renderPreview: (data) => {
            const items = data.data || [];
            return `<div style="overflow-x:auto"><table class="data-table">
                <tbody>${items.slice(0, 50).map(row => `<tr>${Object.values(row).map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
                </table></div>`;
        }
    },

    donki: {
        name: 'DONKI',
        fullName: 'Space Weather Database',
        icon: '',
        badge: 'GET',
        path: '/DONKI',
        description: 'Base de datos del clima espacial. Proporciona informacion sobre llamaradas solares, eyecciones de masa coronal (CME) y tormentas geomagneticas.',
        buildForm: () => `
            <div class="form-group">
                <label>Tipo de evento</label>
                <select id="donki-type">
                    <option value="CME">CME - Eyeccion de masa coronal</option>
                    <option value="FLR">FLR - Llamarada solar</option>
                    <option value="GST">GST - Tormenta geomagnetica</option>
                    <option value="IPS">IPS - Choque interplanetario</option>
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Desde</label>
                    <input type="date" id="donki-start" value="${getWeekAgoStr()}">
                </div>
                <div class="form-group">
                    <label>Hasta</label>
                    <input type="date" id="donki-end" value="${getTodayStr()}">
                </div>
            </div>
        `,
        buildUrl: () => {
            const key = getApiKey();
            const type = val('donki-type');
            return `${API_BASE}/DONKI/${type}?startDate=${val('donki-start')}&endDate=${val('donki-end')}&api_key=${key}`;
        },
        renderPreview: (data) => {
            if (!Array.isArray(data) || data.length === 0) return '<p>No se encontraron eventos para este rango.</p>';
            return `
                <div style="display:flex;flex-direction:column;gap:8px">
                    ${data.map(item => `
                        <div style="padding:10px;background:var(--bg-alt);border:1px solid var(--border)">
                            <strong style="color:var(--orange)">${item.messageType || item.activityID}</strong>
                            <span style="font-size:0.7rem;color:var(--text-dim);margin-left:8px">${item.startTime || item.beginTime || ''}</span>
                            <p style="font-size:0.75rem;margin-top:6px;line-height:1.4">${item.note || item.explanation || 'Ver JSON para mas detalles'}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    },

    eonet: {
        name: 'EONET',
        fullName: 'Natural Event Tracker',
        icon: '',
        description: 'Rastrea eventos naturales en la Tierra en tiempo real.',
        buildForm: () => `<select id="eonet-cat"><option value="wildfires">Incendios</option><option value="volcanoes">Volcanes</option></select>`,
        buildUrl: () => `${EONET_BASE}/events?category=${val('eonet-cat')}`,
        renderPreview: (data) => {
            const evs = data.events || [];
            return `<div>${evs.map(e => `<p>${e.title} - ${e.geometry[0].date}</p>`).join('')}</div>`;
        }
    },

    techtransfer: {
        name: 'TechTransfer',
        fullName: 'NASA Technology Transfer',
        icon: '',
        description: 'Patentes y software de la NASA.',
        buildForm: () => `<input type="text" id="tt-q" value="solar">`,
        buildUrl: () => `${API_BASE}/techtransfer/patent/?${val('tt-q')}&api_key=${getApiKey()}`,
        renderPreview: (data) => {
            const res = data.results || [];
            return `<div>${res.map(r => `<p>${r[2]}</p>`).join('')}</div>`;
        }
    },

    tle: {
        name: 'TLE',
        fullName: 'Two-Line Elements',
        icon: '',
        description: 'Datos orbitales de satelites (Celestrak).',
        buildForm: () => `<input type="text" id="tle-q" value="HUBBLE">`,
        buildUrl: () => `${TLE_BASE}?NAME=${val('tle-q')}&FORMAT=JSON`,
        renderPreview: (data) => {
            if (!Array.isArray(data)) return '<p>Sin datos.</p>';
            return `<div>${data.map(s => `
                <div style="margin-bottom:8px;padding:8px;border:1px solid var(--border)">
                    <strong>${s.OBJECT_NAME}</strong> [${s.NORAD_CAT_ID}]
                    <pre style="font-size:0.65rem;margin-top:4px">${s.TLE_LINE1}\n${s.TLE_LINE2}</pre>
                </div>`).join('')}</div>`;
        }
    },

    genelab: {
        name: 'GeneLab',
        fullName: 'Biology data',
        icon: '',
        description: 'Biologia espacial.',
        buildForm: () => `<input type="text" id="gl-q" value="radiation">`,
        buildUrl: () => `https://osdr.nasa.gov/osdr/data/search?term=${val('gl-q')}&size=10`,
        renderPreview: (data) => {
            const hits = data.hits?.hits || [];
            return `<div>${hits.map(h => `<p>${h._source.Accession}: ${h._source.Study_Title}</p>`).join('')}</div>`;
        }
    }
};

// -- UI Functions ------------------------

/** Cambia el endpoint seleccionado */
function selectEndpoint(key) {
    if (!ENDPOINTS[key]) return;
    currentEndpoint = key;
    const ep = ENDPOINTS[key];

    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    document.querySelector(`.sidebar-item[data-endpoint="${key}"]`)?.classList.add('active');

    const formPanel = document.getElementById('form-panel-content');
    formPanel.innerHTML = `
        <div class="form-panel-header">
            <h2>> ${ep.name}</h2>
            <span class="endpoint-badge">${ep.badge || 'GET'} ${ep.path || ''}</span>
        </div>
        <p class="form-description">${ep.description}</p>
        <div class="form-content">${ep.buildForm()}</div>
        <div class="btn-group">
            <button class="btn btn-primary" id="send-btn" onclick="sendRequest()">
                > Enviar Request
            </button>
            <button class="btn btn-secondary" onclick="clearResults()">
                x Limpiar
            </button>
        </div>
    `;
    clearResults();
}

/** Alterna formularios especificos */
function toggleApodMode() {
    const mode = val('apod-mode');
    document.getElementById('apod-date-field').style.display = mode === 'date' ? '' : 'none';
    document.getElementById('apod-range-fields').style.display = mode === 'range' ? '' : 'none';
    document.getElementById('apod-count-field').style.display = mode === 'random' ? '' : 'none';
}
function toggleMarsMode() {
    const mode = val('mars-mode');
    document.getElementById('mars-sol-field').style.display = mode === 'sol' ? '' : 'none';
    document.getElementById('mars-date-field').style.display = mode === 'earth_date' ? '' : 'none';
}
function toggleExoMode() {
    const preset = val('exo-preset');
    document.getElementById('exo-name-field').style.display = preset === 'byname' ? '' : 'none';
    document.getElementById('exo-custom-field').style.display = preset === 'custom' ? '' : 'none';
}
function toggleSentryMode() {
    const mode = val('sentry-mode');
    document.getElementById('sentry-name-field').style.display = mode === 'byname' ? '' : 'none';
}

/** Envia la request */
async function sendRequest() {
    const ep = ENDPOINTS[currentEndpoint];
    if (!ep) return;

    const btn = document.getElementById('send-btn');
    btn.disabled = true;
    btn.textContent = 'Cargando...';

    let url = ep.buildUrl();
    const useProxy = document.getElementById('use-proxy')?.checked;
    if (useProxy) url = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    document.getElementById('url-text').textContent = url;
    const body = document.getElementById('results-body');
    body.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><span>Contactando NASA...</span></div>`;

    const startTime = performance.now();
    try {
        const response = await fetch(url);
        const duration = Math.round(performance.now() - startTime);
        const text = await response.text();
        const size = new Blob([text]).size;
        let data;
        try { data = JSON.parse(text); } catch (e) { data = text; }

        window._lastResponseData = data;
        window._lastEndpoint = currentEndpoint;
        requestHistory.unshift({ endpoint: ep.name, url, status: response.status, ok: response.ok, duration, size, data });

        if (currentResultView === 'json') body.innerHTML = `<div class="json-viewer">${syntaxHighlight(data)}</div>`;
        else body.innerHTML = ep.renderPreview(data);

        showResponseMeta(response.status, response.ok, duration, size);
        updateHistoryCount();
    } catch (e) {
        const duration = Math.round(performance.now() - startTime);
        body.innerHTML = `<div class="empty-state"><div class="icon">!</div><h3>Error de conexion</h3><p>${e.message}</p></div>`;
        showResponseMeta('ERR', false, duration, 0);
    }
    btn.disabled = false;
    btn.textContent = '> Enviar Request';
}

/** Utilidades de UI */
function clearResults() {
    document.getElementById('url-text').textContent = 'La URL aparecera aqui...';
    document.getElementById('results-body').innerHTML = `<div class="empty-state"><div class="icon">>_</div><h3>Listo para explorar</h3></div>`;
    document.getElementById('response-meta').innerHTML = '';
}
function switchResultsTab(tab) {
    currentResultView = tab;
    document.querySelectorAll('.results-tab').forEach(el => el.classList.remove('active'));
    document.querySelector(`.results-tab[data-tab="${tab}"]`)?.classList.add('active');
    if (tab === 'history') renderHistory();
    else if (window._lastResponseData) {
        const body = document.getElementById('results-body');
        if (tab === 'json') body.innerHTML = `<div class="json-viewer">${syntaxHighlight(window._lastResponseData)}</div>`;
        else body.innerHTML = ENDPOINTS[window._lastEndpoint].renderPreview(window._lastResponseData);
    }
}
function showResponseMeta(status, ok, duration, size) {
    const meta = document.getElementById('response-meta');
    meta.innerHTML = `
        <div class="meta-chip ${ok ? 'success' : 'error'}">Status: ${status}</div>
        <div class="meta-chip">${duration}ms</div>
        <div class="meta-chip">${formatBytes(size)}</div>
    `;
}
function renderHistory() {
    const body = document.getElementById('results-body');
    if (requestHistory.length === 0) {
        body.innerHTML = `<div class="empty-state"><h3>Sin historial</h3></div>`;
        return;
    }
    body.innerHTML = `<div class="history-list">${requestHistory.map((h, i) => `
        <div class="history-item" onclick="replayHistory(${i})">
            <span class="hi-method">GET</span>
            <span class="hi-endpoint">${h.endpoint} - ${h.status}</span>
            <span class="hi-time">${h.duration}ms</span>
        </div>`).join('')}</div>`;
}
function replayHistory(i) {
    const h = requestHistory[i];
    window._lastResponseData = h.data;
    window._lastEndpoint = Object.keys(ENDPOINTS).find(k => ENDPOINTS[k].name === h.endpoint);
    switchResultsTab('preview');
}
function updateHistoryCount() {
    document.getElementById('history-count').textContent = requestHistory.length;
}
function copyUrl() {
    const url = document.getElementById('url-text').textContent;
    navigator.clipboard.writeText(url);
}

// -- Helpers -----------------------------
function getApiKey() { return document.getElementById('api-key-input').value.trim(); }
function val(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function getTodayStr() { return new Date().toISOString().split('T')[0]; }
function getWeekAgoStr() { return addDays(getTodayStr(), -7); }
function addDays(s, n) { const d = new Date(s); d.setDate(d.getDate() + n); return d.toISOString().split('T')[0]; }
function syntaxHighlight(j) {
    if (typeof j !== 'string') j = JSON.stringify(j, null, 2);
    return j.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) cls = 'json-key';
                else cls = 'json-string';
            } else if (/true|false/.test(match)) cls = 'json-bool';
            else if (/null/.test(match)) cls = 'json-null';
            return '<span class="' + cls + '">' + match + '</span>';
        });
}
function formatBytes(b) { if (b === 0) return '0 B'; const k = 1024; const i = Math.floor(Math.log(b) / Math.log(k)); return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + ['B', 'KB', 'MB'][i]; }
function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// -- Init --------------------------------
window.onload = () => { selectEndpoint('apod'); };

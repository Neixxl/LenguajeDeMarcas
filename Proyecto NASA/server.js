const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(cors());
// Servir archivos estáticos del proyecto
app.use(express.static(__dirname));

// Proxy route for NASA SBDB API
app.get('/api/nasa', async (req, res) => {
    const sstr = req.query.sstr;
    if (!sstr) {
        return res.status(400).json({ error: 'Missing sstr parameter' });
    }

    // Nota: El parámetro sstr por sí solo ya devuelve los datos de la órbita (orbit elements)
    const nasaUrl = `https://ssd-api.jpl.nasa.gov/sbdb.api?sstr=${encodeURIComponent(sstr)}`;
    
    console.log(`Forwarding request to NASA: ${nasaUrl}`);

    try {
        const response = await fetch(nasaUrl);
        const data = await response.json();
        
        if (!response.ok) {
            console.warn(`NASA API returned status ${response.status}:`, data);
        }
        
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error fetching from NASA API:', error);
        res.status(500).json({ error: 'Failed to fetch data from NASA API' });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 SERVIDOR LISTO`);
    console.log(`Accede a la aplicación en: http://localhost:${PORT}/mapa_lib.html`);
    console.log(`---------------------------------------------------------`);
});

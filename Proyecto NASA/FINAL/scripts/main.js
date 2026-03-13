document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    requestAnimationFrame(() => {
        const navEntry = performance.getEntriesByType('navigation')[0];
        const isReload = navEntry && navEntry.type === 'reload';

        if (isReload) {
            // Si la pagina se ha recargado se aplica este efecto
            body.classList.add('powerOn');
        } else {
            // Si no entonces es un cambio de nav y se aplica este
            body.classList.add('navTransition');
        }
    });

    // Lógica para el slider de velocidad (si existe en la página)
    const timeSpeed = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedVal');

    if (timeSpeed && speedValue) {
        timeSpeed.addEventListener('input', (event) => {
            speedValue.textContent = event.target.value;
        });
    }
});

// Función para prevenir escritura en la barra de URL
document.addEventListener('keydown', function(e) {
    // Verificar si el elemento activo es la barra de direcciones
    if (document.activeElement === document.querySelector('input[type="text"]')) {
        // Verificar si estamos en la URL específica
        if (window.location.href.includes('/ventas/nueva/')) {
            // Prevenir la acción por defecto
            e.preventDefault();
            // Devolver el foco al documento
            document.body.focus();
        }
    }
});

// Prevenir el acceso directo Alt + D (que enfoca la barra de direcciones)
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
    }
});

// Prevenir el acceso directo Ctrl + L (que enfoca la barra de direcciones)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
    }
});

// También puedes ocultar la barra de direcciones usando CSS
// Nota: Esto solo funcionará en modo kiosko o fullscreen
if (window.location.href.includes('/ventas/nueva/')) {
    document.documentElement.style.setProperty('--url-bar-display', 'none');
}
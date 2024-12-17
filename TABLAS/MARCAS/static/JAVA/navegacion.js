function setupSmartBackButton() {
    // Seleccionar todos los tipos de botones atrás, incluyendo los de todas las ventanas popup
    const backButtons = document.querySelectorAll(
        '.back-button-LP a, ' +           // Lista de productos
        '.back-button-BLS a, ' +          // Bajo stock
        '.back-button-BSTCK a, ' +        // Stock
        '.back-button-CPS a, ' +          // Crear producto
        '.back-button-V a, ' +            // Ventas
        '.back-button-CJASSDE a'          // Caja
    );
    
    if (!backButtons.length) return;

    // Verificar si es una ventana popup
    const isPopup = window.opener !== null;
    
    backButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentPath = window.location.pathname;

            // Si es popup, siempre cerramos la ventana
            if (isPopup) {
                // Si el click fue en el botón de reponer stock, no cerramos
                const clickedElement = e.target.closest('.btn-reponerptss');
                if (clickedElement) {
                    return;
                }
                window.close();
                return;
            }

            // Si es la página de ventas, siempre volvemos a registros
            if (currentPath.includes('/ventas/')) {
                window.location.href = '/registros/';
                return;
            }

            // Para el resto de rutas, mantener la lógica original...
            const searchParams = new URLSearchParams(window.location.search);
            const formType = searchParams.get('form_type');
            
            if (currentPath === '/agregar/' && formType) {
                window.location.href = '/productos/bajo-stock/';
                return;
            }
            
            switch (true) {
                case currentPath.includes('/tablas/editar-producto/'):
                case currentPath.includes('/tablas/crear-producto/'):
                    window.location.href = '/productos/';
                    break;
                    
                case currentPath === '/productos/':
                    window.location.href = '/productos/bajo-stock/';
                    break;
                    
                case currentPath.includes('/productos/bajo-stock/'):
                    window.location.href = '/menu/';
                    break;
                    
                case currentPath.includes('/productos/agregar/'):
                    window.location.href = '/productos/bajo-stock/';
                    break;
                    
                case currentPath.includes('/listar_cajas/'):
                    if (document.referrer.includes('/cajas/')) {
                        window.location.href = '/cajas/';
                    } else {
                        window.location.href = '/registros/';
                    }
                    break;
                    
                case currentPath.includes('/cajas/'):
                case currentPath.includes('/sesiones/'):
                case currentPath.includes('/bolsas/'):
                case currentPath.includes('/graficos/'):
                case currentPath.includes('/empleados/'):
                case currentPath.includes('/lista_movimientos/'):
                case currentPath.includes('/cambio_precios/'):
                    window.location.href = '/registros/';
                    break;
                    
                default:
                    window.location.href = '/menu/';
            }
        });
    });

    // Si es popup, manejar también el botón atrás del navegador
    if (isPopup) {
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function() {
            window.close();
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupSmartBackButton);
document.addEventListener('DOMContentLoaded', function() {
    // Destruir la instancia existente si existe
    if ($.fn.DataTable.isDataTable('.tablee-bolsaF')) {
        $('.tablee-bolsaF').DataTable().destroy();
    }
    
    // Inicializar DataTables en la tabla de bolsas
    let tablaBolsas = $('.tablee-bolsaF').DataTable({
        responsive: false, // Cambiado a false para evitar conflictos
        scrollX: true, // Habilitar scroll horizontal
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        pageLength: 5,
        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
        order: [[0, 'desc']],
        dom: '<"top"lf>rt<"bottom"ip>',
        columnDefs: [
            { className: "text-center", targets: [0, 3, 5, 6, 7] },
            { className: "text-end", targets: [2, 4, 8] }
        ],
        // Configuración adicional para mejorar el scroll
        autoWidth: false,
        scrollCollapse: true,
        initComplete: function(settings, json) {
            $('.dataTables_filter input').addClass('search-input');
            $(window).trigger('resize'); // Forzar recálculo del ancho
        }
    });

    // Recalcular columnas cuando cambie el tamaño de la ventana
    $(window).on('resize', function() {
        tablaBolsas.columns.adjust();
    });

    // Manejar los filtros personalizados
    $('.form-filtros-lb').on('submit', function(e) {
        e.preventDefault();
        
        let fechaApertura = $('#fecha_apertura').val();
        let fechaCierre = $('#fecha_cierre').val();
        
        let url = window.location.pathname + '?';
        if (fechaApertura) url += `&fecha_apertura=${fechaApertura}`;
        if (fechaCierre) url += `&fecha_cierre=${fechaCierre}`;
        
        window.location.href = url;
    });
});
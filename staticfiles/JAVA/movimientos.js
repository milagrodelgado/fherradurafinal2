document.addEventListener('DOMContentLoaded', function() {
    // Destruir la instancia existente si existe
    if ($.fn.DataTable.isDataTable('.table-descuent')) {
        $('.table-descuent').DataTable().destroy();
    }
    
    // Inicializar DataTables
    let tablaMovimientos = $('.table-descuent').DataTable({
        responsive: true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        pageLength: 5,
        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
        order: [[0, 'desc']], // Ordenar por fecha descendente
        dom: '<"top"lf>rt<"bottom"ip>',
        columnDefs: [
            { className: "text-center", targets: [0, 2, 3, 5] }
        ],
        initComplete: function() {
            $('.dataTables_filter input').addClass('search-input');
        }
    });

    // Manejar los filtros personalizados
    $('.btn-filtrar').on('click', function() {
        aplicarFiltros();
    });
});

function aplicarFiltros() {
    let fecha = $('#fecha-filtro').val();
    let motivo = $('#motivo-select').val();
    
    let url = window.location.pathname + '?';
    if (fecha) url += `&fecha=${fecha}`;
    if (motivo) url += `&motivo=${motivo}`;
    
    window.location.href = url;
}

function limpiarFiltros() {
    window.location.href = window.location.pathname;
}
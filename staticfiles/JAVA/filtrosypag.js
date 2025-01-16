document.addEventListener('DOMContentLoaded', function() {
    // Inicializar cualquier tabla con la clase 'datatable'
    $('.datatable').DataTable({
        responsive: true,
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
        },
        pageLength: 5,
        lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
        order: [[0, 'asc']],
        columnDefs: [
            { orderable: false, targets: -1 } // Desactiva ordenamiento en columna de acciones
        ],
        dom: '<"top"lf>rt<"bottom"ip>',
        initComplete: function() {
            $('.dataTables_filter input').addClass('search-input');
        }
    });
});





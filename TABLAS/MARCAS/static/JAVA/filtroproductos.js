// Variable global para mantener la referencia a la tabla
let tablaProductos;

document.addEventListener('DOMContentLoaded', function() {
    // Si la tabla ya está inicializada, no hacer nada
    if ($.fn.DataTable.isDataTable('#table-prtss')) {
        tablaProductos = $('#table-prtss').DataTable();
    } else {
        // Inicializar la tabla solo si no existe
        tablaProductos = $('#table-prtss').DataTable({
            responsive: true,
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/es-ES.json'
            },
            pageLength: 5,
            lengthMenu: [[5, 10, 25, 50], [5, 10, 25, 50]],
            order: [[0, 'asc']],
            columnDefs: [
                { orderable: false, targets: -1 }
            ],
            dom: '<"top"lf>rt<"bottom"ip>'
        });
    }

    // Limpiar filtros existentes
    $.fn.dataTable.ext.search = [];

    // Agregar el nuevo filtro
    $.fn.dataTable.ext.search.push(function(settings, data, dataIndex) {
        let textoProducto = data[1].toLowerCase();
        let animalSeleccionado = $('select[name="animal"]').val();
        let categoriaSeleccionada = $('select[name="categoria"]').val();

        // Verificar si los selectores tienen valor
        if (!animalSeleccionado || !categoriaSeleccionada) {
            return true;
        }

        // Si ambos están en "TODOS", mostrar todo
        if (animalSeleccionado === "TODOS" && categoriaSeleccionada === "TODOS") {
            return true;
        }

        let coincideAnimal = animalSeleccionado === "TODOS" || 
                            textoProducto.includes(animalSeleccionado.toLowerCase());
        let coincideCategoria = categoriaSeleccionada === "TODOS" || 
                               textoProducto.includes(categoriaSeleccionada.toLowerCase());

        return coincideAnimal && coincideCategoria;
    });

    // Manejar eventos de filtro
    $('.select-filter').on('change', function() {
        console.log('Filtro cambiado:', $(this).attr('name'), $(this).val());
        tablaProductos.draw();
    });
});
// Funciones para el manejo del modal de cambio de precios
function mostrarFormularioPrecio(boton) {
    const modal = document.getElementById('modalCambioPrecio');
    const productoId = boton.getAttribute('data-producto-id');
    const precioActual = boton.getAttribute('data-precio-actual');
    
    document.getElementById('producto_id').value = productoId;
    document.getElementById('precio_actual_display').textContent = '$' + precioActual;
    
    // Resetear el formulario
    document.getElementById('formCambioPrecio').reset();
    document.querySelector('.fecha-fin').style.display = 'none';
    
    modal.style.display = 'block';
}

function cerrarFormularioPrecio() {
    const modal = document.getElementById('modalCambioPrecio');
    modal.style.display = 'none';
}

function cambiarTipoCambio() {
    const select = document.querySelector('select[name="tipo_cambio"]');
    const fechaFin = document.querySelector('.fecha-fin');
    const fechaInput = document.querySelector('input[name="fecha_fin"]');
    const labelValor = document.getElementById('label_valor');
    const aplicarCategoria = document.querySelector('input[name="aplicar_categoria"]');
    const valorInput = document.querySelector('input[name="valor_cambio"]');

    // Mostrar/ocultar fecha fin solo para ofertas y descuentos
    if (select.value === 'OFERTA' || select.value === 'DESCUENTO') {
        fechaFin.style.display = 'block';
        fechaInput.required = true;
        
        // Establecer fecha mínima como ahora
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        const nowString = now.toISOString().slice(0, 16);
        fechaInput.min = nowString;
        
        // Establecer una fecha por defecto (1 día después)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setMinutes(tomorrow.getMinutes() - tomorrow.getTimezoneOffset());
        if (!fechaInput.value) {
            fechaInput.value = tomorrow.toISOString().slice(0, 16);
        }
    } else {
        fechaFin.style.display = 'none';
        fechaInput.required = false;
        fechaInput.value = '';
    }

    // Cambiar label y validación según tipo y si aplica a categoría
    if (aplicarCategoria.checked) {
        labelValor.textContent = 'Porcentaje de ' + select.options[select.selectedIndex].text;
        valorInput.setAttribute('max', '100');
        valorInput.setAttribute('min', '0');
        valorInput.setAttribute('step', '0.01');
        valorInput.setAttribute('placeholder', 'Ingrese el porcentaje (ej: 10 para 10%)');
    } else {
        labelValor.textContent = 'Nuevo Precio';
        valorInput.setAttribute('placeholder', 'Ingrese el nuevo precio');
        valorInput.removeAttribute('max');
        valorInput.setAttribute('min', '0');
        valorInput.setAttribute('step', '0.01');
    }
    valorInput.value = '';
}

function toggleAplicarCategoria() {
    const checkbox = document.querySelector('input[name="aplicar_categoria"]');
    const select = document.querySelector('select[name="tipo_cambio"]');
    cambiarTipoCambio();
}

// Manejar el envío del formulario
document.getElementById('formCambioPrecio').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const tipoCambio = formData.get('tipo_cambio');
    
    // Validar fecha para ofertas y descuentos
    if (tipoCambio === 'OFERTA' || tipoCambio === 'DESCUENTO') {
        const fechaFin = formData.get('fecha_fin');
        if (!fechaFin) {
            alert('La fecha de finalización es requerida para ofertas y descuentos');
            return;
        }
        
        const fechaFinDate = new Date(fechaFin);
        const ahora = new Date();
        
        if (fechaFinDate <= ahora) {
            alert('La fecha de finalización debe ser posterior a la fecha actual');
            return;
        }
    } else {
        formData.delete('fecha_fin');
    }
    
    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': formData.get('csrfmiddlewaretoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            cerrarFormularioPrecio();
            location.reload();
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar la solicitud');
    });
});

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modalCambioPrecio');
    if (event.target === modal) {
        cerrarFormularioPrecio();
    }
}

// Asegurarse de que los handlers estén conectados cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Conectar el handler de cambio de tipo
    const tipoSelect = document.querySelector('select[name="tipo_cambio"]');
    if (tipoSelect) {
        tipoSelect.addEventListener('change', cambiarTipoCambio);
    }

    // Conectar el handler de aplicar categoría
    const categoriaCheckbox = document.querySelector('input[name="aplicar_categoria"]');
    if (categoriaCheckbox) {
        categoriaCheckbox.addEventListener('change', toggleAplicarCategoria);
    }
});
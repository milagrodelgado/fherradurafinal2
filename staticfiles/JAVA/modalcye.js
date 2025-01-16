document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalParaTdDelete');
    const closeBtn = document.querySelector('.close-modalParaTd');
    const cancelBtn = document.querySelector('.btn-modalParaTd-cancel');
    const deleteBtn = document.querySelector('.btn-modalParaTd-delete');
    const deleteMessage = document.getElementById('deleteMessageParaTd');
    const errorMessage = document.getElementById('errorMessageParaTd');
    let deleteUrl = '';

    function showModal(url, itemType, itemName) {
        modal.style.display = 'block';
        deleteUrl = url;
        deleteMessage.textContent = `¿Estás seguro de que deseas eliminar ${itemType} "${itemName}"?`;
        if (errorMessage) {
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        deleteUrl = '';
        if (errorMessage) {
            errorMessage.style.display = 'none';
            errorMessage.textContent = '';
        }
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            errorMessage.classList.add('shake');
            setTimeout(() => {
                errorMessage.classList.remove('shake');
            }, 500);
        }
    }

    // Event listeners para los botones de borrar sucursales
    document.querySelectorAll('.btn-borrarsuc').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const sucursalName = row.querySelector('td:nth-child(2)').textContent.trim();
            showModal(this.href, "la sucursal", sucursalName);
        });
    });

    // Event listeners para los botones de borrar clientes
    document.querySelectorAll('.btn-borrarclie').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const row = this.closest('tr');
            const clienteName = row.querySelector('td:nth-child(2)').textContent.trim();
            showModal(this.href, "el cliente", clienteName);
        });
    });

    // Cerrar modal
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Manejar la eliminación
    deleteBtn.addEventListener('click', function() {
        if (deleteUrl) {
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            
            // Deshabilitar el botón durante la petición
            deleteBtn.disabled = true;
            deleteBtn.textContent = 'Eliminando...';

            fetch(deleteUrl, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showError(data.error);
                    // Reactivar el botón en caso de error
                    deleteBtn.disabled = false;
                    deleteBtn.textContent = 'Eliminar';
                } else if (data.success) {
                    // Añadir una pequeña demora antes de recargar
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            })
            .catch(error => {
                showError('Ocurrió un error al procesar la solicitud');
                // Reactivar el botón en caso de error
                deleteBtn.disabled = false;
                deleteBtn.textContent = 'Eliminar';
            });
        }
    });
});




/*eliminar o cambiar estado empleado*/
// Modal state and DOM elements
let empleadoIdActual = null;

// Función para abrir el modal de cambio de estado
function abrirModalEstado(id, nombre, apellido, estaActivo) {
    empleadoIdActual = id;
    const modal = document.getElementById('modalEstado');
    const nombreSpan = document.getElementById('nombreEmpleadoEstado');
    const accionSpan = document.getElementById('accionEstado');
    const advertencia = document.getElementById('advertenciaEstado');
    const form = document.getElementById('formCambiarEstado');

    // Actualizar contenido del modal
    nombreSpan.textContent = `${nombre} ${apellido}`;
    accionSpan.textContent = estaActivo === '1' ? 'desactivar' : 'activar';
    
    // Mostrar advertencia específica
    if (estaActivo === '1') {
        advertencia.textContent = 'Al desactivar el empleado, este no podrá acceder al sistema.';
    } else {
        advertencia.textContent = 'Al activar el empleado, este podrá volver a acceder al sistema.';
    }

    // Configurar el formulario con la URL correcta usando plantillas Django
    form.setAttribute('action', `/cambiar_estado_empleado/${id}/`);
    
    // Mostrar el modal
    modal.style.display = 'block';
}

// Función para abrir el modal de eliminación
function abrirModalBorrar(id, nombre, apellido) {
    empleadoIdActual = id;
    const modal = document.getElementById('modalBorrar');
    const nombreSpan = document.getElementById('nombreEmpleadoBorrar');
    const form = document.getElementById('formBorrarEmpleado');

    // Actualizar contenido del modal
    nombreSpan.textContent = `${nombre} ${apellido}`;
    
    // Configurar el formulario con la URL correcta usando plantillas Django
    form.setAttribute('action', `/eliminar_empleado/${id}/`);
    
    // Mostrar el modal
    modal.style.display = 'block';
}

// Función para cerrar el modal de estado
function cerrarModalEstado() {
    const modal = document.getElementById('modalEstado');
    modal.style.display = 'none';
    empleadoIdActual = null;
}

// Función para cerrar el modal de eliminación
function cerrarModalBorrar() {
    const modal = document.getElementById('modalBorrar');
    modal.style.display = 'none';
    empleadoIdActual = null;
}

// Cerrar modales al hacer clic fuera de ellos
window.onclick = function(event) {
    const modalEstado = document.getElementById('modalEstado');
    const modalBorrar = document.getElementById('modalBorrar');
    
    if (event.target === modalEstado) {
        cerrarModalEstado();
    }
    if (event.target === modalBorrar) {
        cerrarModalBorrar();
    }
}

// Manejar tecla Escape para cerrar modales
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        cerrarModalEstado();
        cerrarModalBorrar();
    }
});

// Prevenir propagación de clics dentro del contenido del modal
document.querySelectorAll('.modal-contenido').forEach(modal => {
    modal.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

// Asegurar que los formularios tengan el token CSRF
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el token CSRF de la cookie
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    // Agregar el token CSRF a todas las solicitudes POST
    const csrftoken = getCookie('csrftoken');
    
    if (csrftoken) {
        document.querySelectorAll('form').forEach(form => {
            if (!form.querySelector('input[name="csrfmiddlewaretoken"]')) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'csrfmiddlewaretoken';
                input.value = csrftoken;
                form.appendChild(input);
            }
        });
    }
});



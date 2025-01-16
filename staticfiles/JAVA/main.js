document.addEventListener('DOMContentLoaded', function() {
    let modal = document.getElementById('modal');
    let openModalBtn = document.getElementById('openModalBtn');
    let closeModalBtn = document.getElementById('closeModalBtn');
    let aperturaCajaForm = document.getElementById('aperturaCajaForm');
    let montoInicialInput = document.getElementById('montoInicial');

    if (openModalBtn) {
        openModalBtn.onclick = function() {
            modal.style.display = "block";
        }
    }

    if (closeModalBtn) {
        closeModalBtn.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Validación para permitir solo números y un máximo de 6 dígitos
    if (montoInicialInput) {
        montoInicialInput.oninput = function() {
            this.value = this.value.replace(/[^0-9]/g, ''); // Solo números
            if (this.value.length > 6) {
                this.value = this.value.slice(0, 6); // Limitar a 6 dígitos
            }
        }
    }

    if (aperturaCajaForm) {
        aperturaCajaForm.onsubmit = function(e) {
            let montoInicial = parseInt(montoInicialInput.value) || 0;
            
            // Nueva validación para monto 0
            if (!montoInicial || montoInicial === 0) {
                alert('MONTO INSUFICIENTE PARA CAMBIO, POR FAVOR INGRESE UN MONTO SUPERIOR A 0');
                e.preventDefault();
                return false;
            }

            if (montoInicial && montoInicial.toString().length <= 6) {
                console.log('Enviando el formulario...'); // Para depuración
                return true; // Permite que el formulario se envíe
            } else {
                alert('Por favor, ingrese un monto inicial válido de hasta 6 dígitos.');
                e.preventDefault(); // Prevenir el envío si no se cumple la validación
                return false;
            }
        }
    }
});




//-------------------------VENTAS------------------------------///
// Otras funciones y código que puedas tener en main.js

/// Inicialización cuando el DOM está listo
// document.addEventListener('DOMContentLoaded', function() {
//     // Inicializar Lucide
//     lucide.createIcons();

//     // Inicializar botones de animales
//     const animalButtons = document.querySelectorAll('.animal-buttons button');
//     animalButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             console.log('Botón de animal clickeado:', this.innerText);
//             mostrarCategorias(this.innerText);
//         });
//     });

//     // Inicializar búsqueda de productos
//     const buscarProductoInput = document.getElementById('buscar-producto');
//     if (buscarProductoInput) {
//         buscarProductoInput.addEventListener('input', function() {
//             const query = this.value.toLowerCase();
//             buscarProductos(query);
//         });
//     }
// });

//     // No cargar todos los productos al inicio
//     // cargarTodosLosProductos();


// function mostrarSugerencias(query) {
//     const sugerenciasContainer = document.getElementById('sugerencias-productos');
//     const listaProductos = document.getElementById('lista-productos');
//     const productos = listaProductos.getElementsByTagName('li');
    
//     sugerenciasContainer.innerHTML = '';
//     sugerenciasContainer.style.display = 'none';

//     if (query.length < 2) return; // No mostrar sugerencias para consultas muy cortas

//     let sugerencias = [];
//     for (let producto of productos) {
//         const texto = producto.textContent.toLowerCase();
//         if (texto.includes(query)) {
//             sugerencias.push(producto.textContent);
//         }
//     }

//     if (sugerencias.length > 0) {
//         sugerenciasContainer.style.display = 'block';
//         sugerencias.forEach(sugerencia => {
//             const div = document.createElement('div');
//             div.textContent = sugerencia;
//             div.addEventListener('click', function() {
//                 document.getElementById('buscar-producto').value = sugerencia;
//                 buscarProductos(sugerencia);
//                 sugerenciasContainer.style.display = 'none';
//             });
//             sugerenciasContainer.appendChild(div);
//         });
//     }
// }
// function reiniciarVenta() {
//     const fragment = document.createDocumentFragment();
//     carritoTemporal = {};
//     actualizarVistaCarrito();

//     document.getElementById('descuento-total').value = '0';
//     document.getElementById('metodo-pago').value = '';

//     ['subtotal-amount', 'descuento-amount', 'total-amount'].forEach(id => {
//         document.getElementById(id).textContent = '0.00';
//     });

//     ventaPreviamenteGuardada = false;

//     const buscarProductoInput = document.getElementById('buscar-producto');
//     if (buscarProductoInput) buscarProductoInput.value = '';

//     const buttons = document.querySelectorAll('.animal-buttons button, .btn-category');
//     buttons.forEach(button => {
//         button.classList.remove('selected');
//         button.disabled = false;
//     });

//     const categoriasProductos = document.getElementById('categorias-productos');
//     if (categoriasProductos) categoriasProductos.style.display = 'none';

//     const listaProductos = document.getElementById('lista-productos');
//     if (listaProductos) listaProductos.innerHTML = '';

//     const productosMostrar = document.getElementById('productos-mostrar');
//     if (productosMostrar) productosMostrar.style.display = 'none';

//     animalSeleccionado = '';
//     currentPage = 1;
//     allProducts = [];

//     if (typeof updatePagination === 'function') updatePagination();
//     document.body.appendChild(fragment);

//     // El modal se cerrará después de completar todo el reinicio
//     setTimeout(() => {
//         cerrarModalVenta();
//     }, 2000);
// }
// function cargarTodosLosProductos() {
//     console.log('Cargando todos los productos...');
//     fetch('/obtener_productos/')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(productos => {
//             console.log('Productos cargados:', productos);
//             const listaProductos = document.getElementById('lista-productos');
//             if (!listaProductos) {
//                 console.error('Elemento lista-productos no encontrado');
//                 return;
//             }
//             listaProductos.innerHTML = '';
//             productos.forEach(producto => {
//                 const li = document.createElement('li');
//                 li.innerText = `${producto.nombre} - ${producto.marca} - ${producto.peso} - $${producto.precio.toFixed(2)} - Stock: ${producto.stock}`;
//                 li.onclick = function() {
//                     agregarProductoAVenta(producto);
//                 };
//                 listaProductos.appendChild(li);
//             });
//             document.getElementById('productos-mostrar').style.display = 'block';
//         })
//         .catch(error => {
//             console.error('Error al cargar productos:', error);
//             const listaProductos = document.getElementById('lista-productos');
//             if (listaProductos) {
//                 listaProductos.innerHTML = '<li>Error al cargar productos. Por favor, intenta de nuevo.</li>';
//             }
//         });
// }


// let animalSeleccionado = '';
//         document.addEventListener('DOMContentLoaded', function() {
//             document.getElementById('categorias-productos').style.display = 'none';
//         })

//         function mostrarCategorias(animal) {
//             animalSeleccionado = animal;
//             document.getElementById('categorias-productos').style.display = 'flex';
//             // Limpiar la lista de productos cuando se selecciona un nuevo animal
//             document.getElementById('lista-productos').innerHTML = '';
//             document.getElementById('productos-mostrar').style.display = 'none';
//         }

//         function mostrarOpcionesSuelto() {
//             document.getElementById('modalSuelto').style.display = 'block';
//             mostrarBolsasAbiertas();  // Agregar esta línea
//         }

//         function abrirNuevaBolsa() {
//             fetch(`/obtener_productos_sueltos/?animal=${encodeURIComponent(animalSeleccionado)}`)
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error(`HTTP error! status: ${response.status}`);
//                     }
//                     return response.json();
//                 })
//                 .then(productos => {
//                     let listaProductos = document.getElementById('listaBolsasAbiertas');
//                     listaProductos.innerHTML = '';
//                     productos.forEach(producto => {
//                         let li = document.createElement('li');
//                         li.textContent = `${producto.marca} - ${producto.animal} - ${producto.peso} - ${producto.precio.toFixed(2)} ARS`;
//                         li.onclick = function() { seleccionarProductoSuelto(producto.id); };
//                         listaProductos.appendChild(li);
//                     });
//                 })
//                 .catch(error => {
//                     console.error('Error al obtener productos sueltos:', error);
//                     alert('Hubo un error al cargar los productos sueltos. Por favor, intenta de nuevo.');
//                 });
//             document.getElementById('productos-mostrar').style.display = 'block';
//         }


        

//         function seleccionarProductoSuelto(productoId) {
//             fetch('/abrir_bolsa/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': getCookie('csrftoken')
//                 },
//                 body: JSON.stringify({
//                     producto_id: productoId,
//                     animal: animalSeleccionado
//                 })
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     alert(data.message);
//                     mostrarBolsasAbiertas(); // Actualizar lista de bolsas
//                 } else {
//                     if (data.bolsa) {
//                         // Si hay una bolsa existente, mostrar mensaje específico
//                         alert('Ya existe una bolsa abierta para este producto. ' +
//                               `Precio restante: $${data.bolsa.precio_restante}`);
//                     } else {
//                         alert('Error: ' + data.error);
//                     }
//                 }
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 alert('Error al procesar la solicitud');
//             });
//         }

//         // Función para seleccionar una bolsa abierta
//         function seleccionarBolsaAbierta(bolsaId, enUltimo50Porciento) {
//             if (enUltimo50Porciento) {
//                 mostrarModalCierreBolsa(bolsaId);
//             } else {
//                 mostrarVentanaVenta(bolsaId);
//             }
//         }

//         function mostrarModalCierreBolsa(bolsaId) {
//             const modal = document.getElementById('cerrarBolsaModal');
//             const aceptarBtn = document.getElementById('aceptarCierreBolsa');
//             const cancelarBtn = document.getElementById('cancelarCierreBolsa');
        
//             modal.style.display = 'block';
        
//             aceptarBtn.onclick = function() {
//                 cerrarBolsa(bolsaId);
//                 modal.style.display = 'none';
//             };
        
//             cancelarBtn.onclick = function() {
//                 modal.style.display = 'none';
//                 mostrarVentanaVenta(bolsaId);
//             };
        
//             // Cerrar el modal si se hace clic fuera de él
//             window.onclick = function(event) {
//                 if (event.target == modal) {
//                     modal.style.display = 'none';
//                 }
//             };
//         }
        
//                 // Función para mostrar la ventana de venta
//         function mostrarVentanaVenta(bolsaId) {
//             const modal = document.getElementById('ventaModal');
//             const montoInput = document.getElementById('montoVenta');
//             const aceptarBtn = document.getElementById('aceptarVenta');
//             const cancelarBtn = document.getElementById('cancelarVenta');

//             modal.style.display = 'block';
//             montoInput.value = '';

//             aceptarBtn.onclick = function() {
//                 const montoVenta = montoInput.value;
//                 if (montoVenta === '') return;

//                 realizarVenta(bolsaId, montoVenta);
//                 modal.style.display = 'none';
//             };

//             cancelarBtn.onclick = function() {
//                 modal.style.display = 'none';
//             };
//         }
        
//         // Función para realizar la venta
//         function realizarVenta(bolsaId, montoVenta) {
//             fetch('/vender_suelto/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': getCookie('csrftoken')
//                 },
//                 body: JSON.stringify({bolsa_id: bolsaId, monto: montoVenta})
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     agregarProductoAVenta(data.producto, true);
//                     mostrarMensaje('Producto suelto agregado a la venta', 'success');
//                     mostrarBolsasAbiertas();
//                     document.getElementById('ventaModal').style.display = 'none';
//                 } else {
//                     mostrarMensaje('Error al agregar producto suelto: ' + data.error, 'error');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 mostrarMensaje('Error al procesar la solicitud: ' + error.message, 'error');
//             });
//         }

//         // Función para cerrar la bolsa
//         function cerrarBolsa(bolsaId) {
//             fetch('/cerrar_bolsa/', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': getCookie('csrftoken')
//                 },
//                 body: JSON.stringify({bolsa_id: bolsaId})
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.success) {
//                     mostrarMensaje('Bolsa cerrada exitosamente', 'success');
//                     mostrarBolsasAbiertas();
//                 } else {
//                     mostrarMensaje('Error al cerrar la bolsa: ' + data.error, 'error');
//                 }
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 mostrarMensaje('Error al procesar la solicitud: ' + error.message, 'error');
//             });
//         }

//                 // Función para mostrar las bolsas abiertas
//         function mostrarBolsasAbiertas() {
//             if (!animalSeleccionado) {
//                 console.error('No se ha seleccionado ningún animal');
//                 mostrarMensaje('Por favor, seleccione un animal primero', 'error');
//                 return;
//             }

//             console.log(`Solicitando bolsas abiertas para animal: ${animalSeleccionado}`);
            
//             fetch(`/obtener_bolsas_abiertas/?animal=${encodeURIComponent(animalSeleccionado)}`)
//                 .then(response => {
//                     if (!response.ok) {
//                         throw new Error(`HTTP error! status: ${response.status}`);
//                     }
//                     return response.json();
//                 })
//                 .then(bolsas => {
//                     let listaBolsas = document.getElementById('listaBolsasAbiertas');
//                     listaBolsas.innerHTML = '';
//                     if (bolsas.length === 0) {
//                         listaBolsas.innerHTML = '<li>No hay bolsas abiertas para este animal.</li>';
//                     } else {
//                         bolsas.forEach(bolsa => {
//                             let li = document.createElement('li');
//                             li.textContent = `${bolsa.producto_info} (Restante: ${bolsa.precio_restante.toFixed(2)} ARS)`;
//                             if (bolsa.en_ultimo_50_porciento) {
//                                 li.textContent += ' - Último 50%';
//                             }
//                             li.onclick = function() { 
//                                 seleccionarBolsaAbierta(bolsa.id, bolsa.en_ultimo_50_porciento); 
//                             };
//                             listaBolsas.appendChild(li);
//                         });
//                     }
//                 })
//                 .catch(error => {
//                     console.error('Error al cargar bolsas abiertas:', error);
//                     mostrarMensaje(`Error al cargar bolsas abiertas: ${error.message}. Por favor, intente de nuevo.`, 'error');
//                 });
//         }

//         document.addEventListener('DOMContentLoaded', function() {
//             // Seleccionar el modal y el botón de cierre del modal de "suelto"
//             let sueltoModal = document.getElementById('modalSuelto');
//             let closeSueltoModalBtn = document.getElementById('closeSueltoModal');
        
//             // Cerrar el modal al hacer clic en el botón de cerrar (&times;)
//             closeSueltoModalBtn.onclick = function() {
//                 sueltoModal.style.display = 'none';
//             };
        
//             // Cerrar el modal al hacer clic fuera de él
//             window.onclick = function(event) {
//                 if (event.target == sueltoModal) {
//                     sueltoModal.style.display = 'none';
//                 }
//             };
//         });
//         function mostrarMensaje(mensaje, tipo = 'success') {
//             const modal = document.getElementById('modal-confirmacion-venta');
//             const mensajeElement = document.getElementById('mensaje-confirmacion-venta');
            
//             if (!modal || !mensajeElement) {
//                 console.error('Elementos del modal no encontrados');
//                 return;
//             }
        
//             mensajeElement.textContent = mensaje;
//             modal.style.display = 'block';
            
//             const icono = modal.querySelector('.mensaje-icono');
//             if (icono) {
//                 icono.style.color = tipo === 'success' ? '#28a745' : '#dc3545';
//             }
//         }
        
//         function cerrarModalVenta() {
//             const modal = document.getElementById('modal-confirmacion-venta');
//             if (modal) {
//                 modal.style.display = 'none';
//             }
//         }
//         document.addEventListener('DOMContentLoaded', function() {
//             const modal = document.getElementById('modal-confirmacion-venta');
//             const cerrarBtn = document.querySelector('.cerrar-modal-v');
//             const aceptarBtn = document.querySelector('.boton-aceptar-v');
        
//             if (cerrarBtn) {
//                 cerrarBtn.onclick = cerrarModalVenta;
//             }
        
//             if (aceptarBtn) {
//                 aceptarBtn.onclick = cerrarModalVenta;
//             }
        
//             if (modal) {
//                 modal.onclick = function(event) {
//                     if (event.target === modal) {
//                         cerrarModalVenta();
//                     }
//                 };
//             }
//         });
        
//         // Función auxiliar para obtener el token CSRF
//         function getCookie(name) {
//             let cookieValue = null;
//             if (document.cookie && document.cookie !== '') {
//                 const cookies = document.cookie.split(';');
//                 for (let i = 0; i < cookies.length; i++) {
//                     const cookie = cookies[i].trim();
//                     if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                         break;
//                     }
//                 }
//             }
//             return cookieValue;
//         }

//         // Función modificada para cargar y mostrar productos
//         function getProductosNoEnCarrito(productos) {
//             // Obtener IDs de productos en el carrito
//             const idsEnCarrito = Object.values(carritoTemporal).map(item => item.id);
            
//             // Filtrar productos que no están en el carrito
//             return productos.filter(producto => !idsEnCarrito.includes(producto.id));
//         }
        
//         // Función modificada para mostrar productos
//         function mostrarProductos(animal, categoria) {
//             console.log('Cargando productos para:', animal, categoria);
            
//             const listaProductos = document.getElementById('lista-productos');
//             if (!listaProductos) return;
            
//             listaProductos.innerHTML = '<li>Cargando productos...</li>';
            
//             fetch(`/obtener_productos/?animal=${encodeURIComponent(animal)}&categoria=${encodeURIComponent(categoria)}`)
//                 .then(response => {
//                     if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
//                     return response.json();
//                 })
//                 .then(productos => {
//                     // Guardar productos originales
//                     allProducts = productos;
//                     showProductsForPage(1);
//                     document.getElementById('productos-mostrar').style.display = 'block';
//                 })
//                 .catch(error => {
//                     console.error('Error al cargar productos:', error);
//                     listaProductos.innerHTML = '<li>Error al cargar productos. Por favor, intente de nuevo.</li>';
//                 });
//         }
        
//         // Función para mostrar productos de una página específica
//         function showProductsForPage(page) {
//             if (!allProducts || !allProducts.length) return;
        
//             const startIndex = (page - 1) * productsPerPage;
//             const endIndex = startIndex + productsPerPage;
//             const productsToShow = allProducts.slice(startIndex, endIndex);
            
//             mostrarListaProductos(productsToShow);
//             currentPage = page;
//             updatePagination();
//         }
        
//         // Actualizar paginación
//         function updatePagination() {
//             const totalPages = Math.ceil(allProducts.length / productsPerPage);
//             document.getElementById('current-page').textContent = currentPage;
//             document.getElementById('total-pages').textContent = totalPages;
            
//             document.getElementById('prev-page').disabled = currentPage === 1;
//             document.getElementById('next-page').disabled = currentPage === totalPages;
//         }
        
//         // Configurar event listeners cuando el DOM está listo
//         document.addEventListener('DOMContentLoaded', function() {
//             // Configurar búsqueda de productos
//             const buscarProductoInput = document.getElementById('buscar-producto');
//             if (buscarProductoInput) {
//                 let timeoutId;
//                 buscarProductoInput.addEventListener('input', function() {
//                     clearTimeout(timeoutId);
//                     timeoutId = setTimeout(() => {
//                         buscarProductos(this.value);
//                     }, 300);
//                 });
//             }
        
//             // Configurar paginación
//             document.getElementById('prev-page')?.addEventListener('click', () => {
//                 if (currentPage > 1) showProductsForPage(currentPage - 1);
//             });
        
//             document.getElementById('next-page')?.addEventListener('click', () => {
//                 const totalPages = Math.ceil(allProducts.length / productsPerPage);
//                 if (currentPage < totalPages) showProductsForPage(currentPage + 1);
//             });
//         });


// // Objeto para almacenar el carrito temporal
// let carritoTemporal = {};

// // Función para agregar producto al carrito temporal
// function agregarProductoAVenta(producto, esSuelto = false) {
//     const productoId = esSuelto ? `suelto-${producto.id}-${producto.bolsa_id}` : producto.id.toString();
    
//     if (carritoTemporal[productoId]) {
//         if (!esSuelto) {
//             if (carritoTemporal[productoId].cantidad < producto.stock) {
//                 carritoTemporal[productoId].cantidad++;
//                 actualizarVistaCarrito();
//             } else {
//                 mostrarMensaje("No hay suficiente stock disponible.", "error");
//             }
//         } else {
//             mostrarMensaje("Este producto suelto ya está en el carrito.", "error");
//         }
//     } else {
//         carritoTemporal[productoId] = {
//             ...producto,
//             id: producto.id,
//             carritoId: productoId,
//             cantidad: esSuelto ? 1 : 1,
//             esSuelto: esSuelto,
//             bolsa_id: esSuelto ? producto.bolsa_id : null,
//             monto_venta: esSuelto ? parseFloat(producto.monto_venta) : null
//         };
//         actualizarVistaCarrito();
//     }
// }

// // Función para actualizar la vista del carrito
// function actualizarVistaCarrito() {
//     const tablaVenta = document.getElementById('productos-venta');
//     tablaVenta.innerHTML = '';
    
//     for (const [carritoId, item] of Object.entries(carritoTemporal)) {
//         const fila = tablaVenta.insertRow();
//         fila.dataset.productoId = carritoId;
        
//         if (item.esSuelto) {
//             fila.innerHTML = `
//                 <td>${item.nombre}</td>
//                 <td>-</td>
//                 <td>-</td>
//                 <td>$${item.monto_venta.toFixed(2)}</td>
//                 <td><button onclick="eliminarProductoCarrito('${carritoId}')" class="btn-eliminar">X</button></td>
//             `;
//         } else {
//             // Construir el nombre completo del producto
//             let nombreCompleto = `${item.marca} - ${item.nombre}`;
//             if (item.peso && item.peso !== 'N/A') {
//                 nombreCompleto += ` - ${item.peso}`;
//             } else if (item.obs) {
//                 nombreCompleto += ` - ${item.obs}`;
//             }

//             fila.innerHTML = `
//                 <td>${nombreCompleto}</td>
//                 <td><input type="number" value="${item.cantidad}" min="1" max="${item.stock}" onchange="actualizarCantidadCarrito('${carritoId}', this.value)"></td>
//                 <td>$${item.precio.toFixed(2)}</td>
//                 <td>$${(item.precio * item.cantidad).toFixed(2)}</td>
//                 <td><button onclick="eliminarProductoCarrito('${carritoId}')" class="btn-eliminar">X</button></td>
//             `;
//         }
//     }
    
//     actualizarTotal();
// }

// // Función para actualizar la cantidad de un producto en el carrito
// function actualizarCantidadCarrito(carritoId, nuevaCantidad) {
//     const item = carritoTemporal[carritoId];
//     nuevaCantidad = parseInt(nuevaCantidad);
    
//     if (!item.esSuelto) {
//         if (nuevaCantidad > 0 && nuevaCantidad <= item.stock) {
//             item.cantidad = nuevaCantidad;
//         } else if (nuevaCantidad > item.stock) {
//             mostrarMensaje("No hay suficiente stock disponible.", "error");
//             item.cantidad = item.stock;
//         }
//     }
    
//     actualizarVistaCarrito();
// }

// // Función para eliminar un producto del carrito
// function eliminarProductoCarrito(carritoId) {
//     delete carritoTemporal[carritoId];
//     actualizarVistaCarrito();
// }

// function devolverMontoABolsa(producto) {
//     fetch('/devolver_monto_bolsa/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': getCookie('csrftoken')
//         },
//         body: JSON.stringify({
//             bolsa_id: producto.bolsa_id,
//             monto: producto.monto_venta
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (!data.success) {
//             console.error('Error al devolver monto a la bolsa:', data.error);
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

// // Función para actualizar el total
// function actualizarTotal() {
//     let subtotal = 0;
    
//     // Calcular subtotal sumando todos los productos
//     Object.values(carritoTemporal).forEach(item => {
//         if (item.esSuelto || item.es_suelto) {
//             subtotal += parseFloat(item.monto_venta || item.precio);
//         } else {
//             subtotal += item.precio * item.cantidad;
//         }
//     });

//     // Obtener el descuento seleccionado
//     const descuentoPorcentaje = parseInt(document.getElementById('descuento-total').value) || 0;
    
//     // Calcular el monto del descuento
//     const montoDescuento = (subtotal * descuentoPorcentaje) / 100;
    
//     // Calcular el total final
//     const totalFinal = subtotal - montoDescuento;

//     // Actualizar los elementos en el DOM
//     document.getElementById('subtotal-amount').textContent = subtotal.toFixed(2);
//     document.getElementById('descuento-amount').textContent = montoDescuento.toFixed(2);
//     document.getElementById('total-amount').textContent = totalFinal.toFixed(2);

//     return {
//         subtotal: subtotal,
//         descuento: montoDescuento,
//         total: totalFinal
//     };
// }


// // Declarar la variable en el ámbito global del script
// let ventaPreviamenteGuardada = false;

// // Modificar solo la parte de datos en la función guardarVenta
// function guardarVenta(pagada = false) {
//     if (Object.keys(carritoTemporal).length === 0) {
//         mostrarMensaje('No hay productos en la venta', 'error');
//         return;
//     }

//     if (!pagada && hayProductosSueltosEnCarrito()) {
//         mostrarMensaje('No se pueden guardar ventas con productos sueltos. Debe completar la venta.', 'error');
//         return;
//     }

//     const metodoPago = document.getElementById('metodo-pago').value;
//     if (!metodoPago) {
//         mostrarMensaje('Por favor seleccione un método de pago', 'error');
//         return;
//     }

//     const totales = actualizarTotal();
//     const productos = Object.values(carritoTemporal).map(item => ({
//         id: item.id,
//         cantidad: parseFloat(item.cantidad) || 1,
//         precio: parseFloat(item.es_suelto ? item.monto_venta : item.precio),
//         es_suelto: Boolean(item.es_suelto),
//         bolsa_id: item.bolsa_id || null,
//         monto_venta: item.monto_venta ? parseFloat(item.monto_venta) : null,
//         nombre: item.nombre
//     }));

//     const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
//     const datos = {
//         productos: productos,
//         total_final: totales.total,
//         pagada: pagada,
//         metodo_pago: metodoPago,
//         descuento: parseInt(document.getElementById('descuento-total').value) || 0
//     };

//     console.log('Datos a enviar:', datos);

//     fetch('/ventas/nueva/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': csrftoken
//         },
//         body: JSON.stringify(datos)
//     })
//     .then(response => {
//         if (!response.ok) {
//             return response.json().then(data => {
//                 throw new Error(data.error || 'Error desconocido');
//             });
//         }
//         return response.json();
//     })
//     .then(data => {
//         if (data.success) {
//             const mensajeExito = pagada ? 
//                 `Venta pagada exitosamente con ${getMetodoPagoTexto(metodoPago)}. ¡Operación completada!` : 
//                 'Venta guardada exitosamente';
            
//             mostrarMensaje(mensajeExito, 'success');
            
//             setTimeout(() => {
//                 reiniciarVenta();
//             }, 2000);
//         } else {
//             throw new Error(data.error || 'Error desconocido');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         mostrarMensaje('Error al procesar la venta: ' + error.message, 'error');
//     });
// }
// function finalizarVenta(resultados, pagada, metodoPago) {
//     carritoTemporal = {};
//     actualizarVistaCarrito();
    
//     let mensajeExito = pagada ?
//         `Venta pagada exitosamente con ${getMetodoPagoTexto(metodoPago)}. ¡Operación completada!` :
//         `Venta guardada exitosamente - ${getMetodoPagoTexto(metodoPago)}`;
    
//     mostrarMensaje(mensajeExito, 'success');
    
//     document.getElementById('metodo-pago').value = '';
//     ventaPreviamenteGuardada = true;
    
//     setTimeout(() => {
//         reiniciarVenta();
//     }, 2000);
// }

// // Cerrar el modal si se hace clic fuera de él
// window.onclick = function(event) {
//     const modal = document.getElementById('modal-confirmacion-venta');
//     if (event.target == modal) {
//         cerrarModalVenta();
//     }
// }

// // Función para reiniciar el estado cuando se inicia una nueva venta
// function iniciarNuevaVenta() {
//     ventaPreviamenteGuardada = false;
//     carritoTemporal = {};
//     actualizarVistaCarrito();
//     // Agregar aquí cualquier otra inicialización necesaria
// }

// // Función helper para obtener texto descriptivo del método de pago
// function getMetodoPagoTexto(metodoPago) {
//     const metodosTexto = {
//         'Efectivo': 'Efectivo',
//         'Tarjeta debito': 'Tarjeta de Débito',
//         'Transferencia': 'Transferencia'
//     };
//     return metodosTexto[metodoPago] || metodoPago;
// }


// // Función para validar el método de pago antes de procesar
// function validarMetodoPago() {
//     const metodoPago = document.getElementById('metodo-pago').value;
//     if (!metodoPago) {
//         mostrarMensaje('Debe seleccionar un método de pago', 'error');
//         return false;
//     }
//     return true;
// }
// function validarVenta() {
//     const metodoPago = document.getElementById('metodo-pago').value;
//     if (!metodoPago) {
//         mostrarMensaje('Por favor seleccione un método de pago', 'error');
//         return false;
//     }
//     return true;
// }
// // Función para cancelar la venta
// function cancelarVenta() {
//     if (confirm('¿Está seguro de que desea cancelar la venta?')) {
//         carritoTemporal = {};  // Limpiar completamente el carrito temporal
//         actualizarVistaCarrito();
//         mostrarMensaje('Venta cancelada', 'info');
//     }
// }


// // No se debe cambiar el stock al agregar al carrito, solo cuando se confirme la venta

// function actualizarSubtotal(fila) {
//     const cantidad = parseInt(fila.cells[1].getElementsByTagName('input')[0].value);
//     const precio = parseFloat(fila.cells[2].innerText.replace('$', ''));
//     const subtotal = precio * cantidad;
//     fila.cells[3].getElementsByClassName('subtotal')[0].innerText = subtotal.toFixed(2);
//     actualizarTotal();
// }





// function imprimirVenta() {
//     window.print();
// }


// // Modificar la función buscarProductos para mantener la vista del carrito
// let allProducts = [];
// let currentPage = 1;
// const productsPerPage = 7;

// // Función principal de búsqueda independiente del carrito
// function buscarProductos(query) {
//     const searchQuery = query.toLowerCase().trim();
//     const listaProductos = document.getElementById('lista-productos');
    
//     if (!listaProductos) return;

//     // Obtener todos los productos que coinciden con la búsqueda
//     const productosFiltrados = allProducts.filter(producto => {
//         const searchableText = [
//             producto.nombre,
//             producto.marca,
//             producto.peso,
//             producto.categoria,
//             producto.animal,
//             (producto.peso ? producto.peso.toString() : '')
//         ].filter(Boolean).join(' ').toLowerCase();

//         return searchQuery.split(' ').every(term => searchableText.includes(term));
//     });

//     mostrarListaProductos(productosFiltrados);
// }
// // Modificar el event listener del DOMContentLoaded para evitar duplicar contadores
// document.addEventListener('DOMContentLoaded', function() {
//     const buscarProductoInput = document.getElementById('buscar-producto');
//     if (buscarProductoInput) {
//         // Eliminar contadores existentes
//         document.querySelectorAll('.resultados-count').forEach(contador => contador.remove());
        
//         // Crear un único contador
//         const contador = document.createElement('div');
//         contador.className = 'resultados-count';
//         contador.style.color = '#fff';
//         contador.style.marginTop = '5px';
//         contador.style.fontSize = '0.9em';
//         contador.textContent = `${allProducts.length} resultados encontrados`;
//         buscarProductoInput.parentNode.insertBefore(contador, buscarProductoInput.nextSibling);

//         let timeoutId;
//         buscarProductoInput.addEventListener('input', function() {
//             clearTimeout(timeoutId);
//             timeoutId = setTimeout(() => {
//                 buscarProductos(this.value);
//             }, 300);
//         });
//     }
// });


// function mostrarListaProductos(productos) {
//     const listaProductos = document.getElementById('lista-productos');
//     listaProductos.innerHTML = '';

//     if (productos.length === 0) {
//         listaProductos.innerHTML = '<div style="text-align: center; color: #ff6b6b; padding: 10px;">No se encontraron productos que coincidan con la búsqueda</div>';
//         return;
//     }

//     productos.forEach(producto => {
//         const li = document.createElement('li');
//         li.className = 'producto-item';
//         li.style.cursor = 'pointer';
//         li.style.padding = '10px';
//         li.style.backgroundColor = '#333333';
//         li.style.marginBottom = '5px';
//         li.style.borderRadius = '5px';
//         li.style.transition = 'background-color 0.3s ease';

//         li.onmouseover = () => li.style.backgroundColor = '#444444';
//         li.onmouseout = () => li.style.backgroundColor = '#333333';

//         // Construir el nombre del producto
//         let nombreMostrar = '';
//         if (producto.peso && producto.peso !== 'N/A') {
//             nombreMostrar = `${producto.nombre} - ${producto.marca} - ${producto.peso} - $${producto.precio.toFixed(2)} - Stock: ${producto.stock}`;
//         } else {
//             nombreMostrar = `${producto.nombre} - ${producto.marca} - $${producto.precio.toFixed(2)} - Stock: ${producto.stock}`;
//         }

//         li.innerText = nombreMostrar;
//         li.onclick = () => agregarProductoAVenta(producto);
//         listaProductos.appendChild(li);
//     });

//     // Actualizar contador de resultados
//     const contador = document.querySelector('.resultados-count');
//     if (contador) {
//         contador.textContent = `${productos.length} resultado${productos.length !== 1 ? 's' : ''} encontrado${productos.length !== 1 ? 's' : ''}`;
//     }
// }



// function actualizarContador(cantidad) {
//     // Remover contadores existentes
//     document.querySelectorAll('.contador-resultados').forEach(contador => contador.remove());

//     // Crear nuevo contador
//     const contador = document.createElement('div');
//     contador.className = 'contador-resultados';
//     contador.style.color = '#fff';
//     contador.style.marginTop = '5px';
//     contador.style.fontSize = '0.9em';
//     contador.textContent = `${cantidad} resultado${cantidad !== 1 ? 's' : ''} encontrado${cantidad !== 1 ? 's' : ''}`;

//     const buscarProductoInput = document.getElementById('buscar-producto');
//     if (buscarProductoInput && buscarProductoInput.parentNode) {
//         buscarProductoInput.parentNode.insertBefore(contador, buscarProductoInput.nextSibling);
//     }
// }



// // Función auxiliar para obtener el token CSRF
// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== '') {
//         const cookies = document.cookie.split(';');
//         for (let i = 0; i < cookies.length; i++) {
//             const cookie = cookies[i].trim();
//             if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }



// function hayProductosSueltosEnCarrito() {
//     return Object.values(carritoTemporal).some(item => item.es_suelto);
// }


/*reponer*/

// Namespace para reposición de stock
const StockManager = {
    currentProductId: null,
    isLowStockPage: false,

    init() {
        this.isLowStockPage = window.location.pathname.includes('baja_existencia');
        this.initializeElements();
        this.setupEventListeners();
        this.setupProductSearch();
        this.setupToastStyles();
    },

    initializeElements() {
        if (window?.lucide?.createIcons) {
            lucide.createIcons();
        }

        const alertCount = document.querySelector('.alert-count');
        if (alertCount && !alertCount.style.display) {
            const bellIcon = document.querySelector('[data-lucide="bell"]');
            if (bellIcon) {
                bellIcon.parentElement.style.animation = 'bellShake 0.5s cubic-bezier(.36,.07,.19,.97) both';
            }
        }
    },

    actualizarContadorAlertas() {
        fetch('/check_alerts/')
            .then(response => response.json())
            .then(data => {
                const alertCount = document.querySelector('.alert-count');
                if (alertCount) {
                    if (data.count > 0) {
                        alertCount.textContent = data.count;
                        alertCount.style.display = 'block';
                        
                        const bellIcon = document.querySelector('[data-lucide="bell"]');
                        if (bellIcon) {
                            bellIcon.parentElement.style.animation = 'none';
                            setTimeout(() => {
                                bellIcon.parentElement.style.animation = 'bellShake 0.5s cubic-bezier(.36,.07,.19,.97) both';
                            }, 10);
                        }
                    } else {
                        alertCount.style.display = 'none';
                    }
                }
            })
            .catch(error => console.error('Error actualizando alertas:', error));
    },

    actualizarFilaProducto(productoId, nuevoStock) {
        const fila = document.querySelector(`tr[data-id="${productoId}"]`);
        if (fila) {
            const stockCell = fila.querySelector('td:nth-child(3)');
            if (stockCell) {
                stockCell.textContent = nuevoStock;
                
                // Si el nuevo stock es mayor que el stock mínimo, podemos ocultar la fila
                const producto = fila.querySelector('td:nth-child(2)').textContent;
                this.showToast(`Stock actualizado para ${producto}`, 'success');
            }
        }
    },

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background-color: ${type === 'success' ? '#00ff9d' : '#ff4444'};
            color: ${type === 'success' ? '#000' : '#fff'};
            border-radius: 4px;
            z-index: 9999;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    setupToastStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    },

    

    abrirModalReposicion(element) {
        const modal = document.getElementById('modalReposicion');
        const modalTitle = document.getElementById('modalTitle');
        const modalMensaje = document.getElementById('modalMensaje');
        
        this.currentProductId = element.getAttribute('data-id');
        
        const fila = element.closest('tr');
        const stockActual = fila ? fila.querySelector('td:nth-child(3)').textContent.trim() : '0';
        const nombreProducto = fila ? fila.querySelector('td:nth-child(2)').textContent.trim() : '';
        
        // Agregar estilos al modal
        const styles = document.createElement('style');
        styles.textContent = `
            .modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                z-index: 1000;
            }

            .modal-pr {
                position: relative;
                background-color: #333;
                margin: 15% auto;
                padding: 20px;
                width: 50%;
                max-width: 500px;
                border-radius: 8px;
                color: white;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            }

            .modal-pr h2 {
                color: #ff8c00;
                margin-bottom: 20px;
            }

            .modal-pr input[type="number"] {
                width: 100%;
                padding: 10px;
                margin: 10px 0;
                background-color: #444;
                border: 1px solid #555;
                border-radius: 4px;
                color: white;
            }

            .modal-pr button {
                margin: 10px 5px;
                padding: 8px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .btn-confirmar {
                background-color: #00ff9d;
                color: black;
            }

            .btn-cancelar {
                background-color: #ff4444;
                color: white;
            }

            .closepr {
                position: absolute;
                right: 10px;
                top: 10px;
                color: #999;
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
                transition: color 0.3s;
            }

            .closepr:hover {
                color: #ff8c00;
            }
        `;
        
        document.head.appendChild(styles);
        
        modalTitle.textContent = 'Reponer Stock';
        modalMensaje.innerHTML = `
            <p><strong>${nombreProducto}</strong></p>
            <p>Stock actual: <strong>${stockActual}</strong></p>
            <p>¿Cuántas unidades deseas reponer?</p>
        `;
        
        modal.style.display = "block";
        
        const cantidadInput = document.getElementById('cantidad');
        if (cantidadInput) {
            cantidadInput.value = '';
            cantidadInput.focus();
        }
    },

    cerrarModalReposicion() {
        const modal = document.getElementById('modalReposicion');
        modal.style.display = "none";
        this.currentProductId = null;
        
        const cantidadInput = document.getElementById('cantidad');
        if (cantidadInput) {
            cantidadInput.value = '';
        }
    },

    getCookie(name) {
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
    },

    

    // Elimina uno de los reponerStock() y reemplázalo con esta versión mejorada
    reponerStock() {
        if (!this.currentProductId) {
            this.showToast('Error: No se pudo identificar el producto', 'error');
            return;
        }

        const cantidad = document.getElementById('cantidad').value;
        if (!cantidad || cantidad <= 0) {
            this.showToast('La cantidad debe ser mayor a 0', 'error');
            return;
        }

        fetch(`/productos/reposicion_producto/${this.currentProductId}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCookie('csrftoken')
            },
            body: JSON.stringify({ cantidad: parseInt(cantidad) })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Cerrar el modal de reposición
                this.cerrarModalReposicion();
                
                // Mostrar el modal de éxito
                this.showSuccessModal('¡Stock actualizado correctamente!');
                
                // Actualizar la interfaz si es necesario
                if (data.nuevo_stock !== undefined) {
                    this.actualizarFilaProducto(this.currentProductId, data.nuevo_stock);
                }
                
                // Actualizar el contador de alertas
                this.actualizarContadorAlertas();
                
                // Recargar la página después de un breve retraso
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                throw new Error(data.message || 'Error al reponer stock');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            this.showToast(`Error al procesar la solicitud: ${error.message}`, 'error');
        });
    },
    showSuccessModal(message) {
        // Agregar estilos si no existen
        if (!document.getElementById('success-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'success-modal-styles';
            styles.textContent = `
                .success-modal {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background-color: rgba(0, 0, 0, 0.8);
                    padding: 20px;
                    border-radius: 8px;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease-out;
                    display: none;
                }
    
                .success-modal-content {
                    text-align: center;
                    color: white;
                    min-width: 300px;
                    padding: 20px;
                }
    
                .success-icon {
                    font-size: 48px;
                    color: #00ff9d;
                    margin-bottom: 10px;
                }
    
                .success-message {
                    font-size: 18px;
                    margin-top: 10px;
                    color: white;
                }
    
                @keyframes fadeIn {
                    from { 
                        opacity: 0;
                        transform: translate(-50%, -40%);
                    }
                    to { 
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }
    
                @keyframes fadeOut {
                    from { 
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                    to { 
                        opacity: 0;
                        transform: translate(-50%, -60%);
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    
        // Crear el modal de éxito si no existe
        let successModal = document.getElementById('successModal');
        if (!successModal) {
            successModal = document.createElement('div');
            successModal.id = 'successModal';
            successModal.className = 'success-modal';
            successModal.innerHTML = `
                <div class="success-modal-content">
                    <div class="success-icon">✓</div>
                    <div class="success-message"></div>
                </div>
            `;
            document.body.appendChild(successModal);
        }
    
        // Actualizar y mostrar el mensaje
        const messageElement = successModal.querySelector('.success-message');
        messageElement.textContent = message;
        successModal.style.display = 'block';
    
        // Remover después de un tiempo
        setTimeout(() => {
            successModal.style.animation = 'fadeOut 0.3s ease-in';
            setTimeout(() => {
                successModal.style.display = 'none';
                successModal.style.animation = '';
            }, 300);
        }, 1200);
    },

    setupProductSearch() {
        const searchInput = document.getElementById('searchprodl');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                if (e.target.value.length >= 2) {
                    fetch(`/autocomplete_productos/?term=${encodeURIComponent(e.target.value)}`)
                        .then(response => response.json())
                        .then(data => {
                            const resultsDiv = document.getElementById('searchResults');
                            resultsDiv.innerHTML = '';
                            data.forEach(producto => {
                                const div = document.createElement('div');
                                div.textContent = producto;
                                div.className = 'search-result-item';
                                div.addEventListener('click', () => {
                                    searchInput.value = producto;
                                    resultsDiv.innerHTML = '';
                                });
                                resultsDiv.appendChild(div);
                            });
                        });
                }
            });
        }
    },

    setupEventListeners() {
        const cantidadInput = document.getElementById('cantidad');
        if (cantidadInput) {
            cantidadInput.addEventListener('input', function() {
                this.value = this.value.replace(/[^0-9]/g, '');
                if (this.value.length > 2) {
                    this.value = this.value.slice(0, 2);
                }
            });

            cantidadInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.reponerStock();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarModalReposicion();
            }
        });

        const closeButtons = document.querySelectorAll('.close, .closepr');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.cerrarModalReposicion());
        });
    }
};

// Inicializar el gestor de stock cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    StockManager.init();
});




//ERRORES AL AGREGAR PK//
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addElementForm');
    const successModal = document.getElementById('elementSuccessModal');
    const errorModal = document.getElementById('errorModal');
    const closeSuccessModalBtn = document.getElementById('closeElementModalBtn');
    const closeErrorModalBtn = document.getElementById('closeErrorModalBtn');
    const successMessage = document.getElementById('elementSuccessMessage');
    const redirectElementBtn = document.getElementById('redirectElementBtn');

    let redirectUrl = ''; // Variable para almacenar la URL de redirección

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
                    'X-Requested-With': 'XMLHttpRequest'
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    successMessage.textContent = `${data.type} ha sido agregado con éxito.`;
                    redirectUrl = data.redirect_url; // Almacenar la URL de redirección
                    successModal.style.display = 'block';
                    
                    // Clear all form fields
                    form.reset();
                } else {
                    let errorHtml = '<ul>';
                    for (let field in data.errors) {
                        errorHtml += `<li>${field}: ${data.errors[field].join(', ')}</li>`;
                    }
                    errorHtml += '</ul>';
                    document.getElementById('modal-body').innerHTML = errorHtml;
                    errorModal.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al enviar el formulario: ' + error.message);
            });
        });
    }

    // Cierre de modales
    closeSuccessModalBtn.onclick = function() {
        successModal.style.display = 'none';
    };

    closeErrorModalBtn.onclick = function() {
        errorModal.style.display = 'none';
    };

    // Redirigir al hacer clic en el botón de redirección
    if (redirectElementBtn) {
        redirectElementBtn.onclick = function() {
            if (redirectUrl) {
                window.location.href = redirectUrl; // Redirigir a la URL almacenada
            } else {
                console.error('URL de redirección no definida');
            }
        };
    }

    // Cerrar modales al hacer clic fuera de ellos
    window.onclick = function(event) {
        if (event.target == successModal) {
            successModal.style.display = 'none';
        }
        if (event.target == errorModal) {
            errorModal.style.display = 'none';
        }
    };
});

/* editar precio*/
document.addEventListener('DOMContentLoaded', function() {
    let precioInput = document.getElementById('id_precio');
    
    precioInput.addEventListener('input', function(e) {
        let value = e.target.value;
        
        // Permitir solo números, un punto o una coma
        value = value.replace(/[^0-9.,]/g, '');
        
        // Asegurar que solo haya un separador decimal
        let parts = value.split(/[.,]/);
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        // Limitar a dos decimales
        if (parts.length > 1) {
            value = parts[0] + '.' + parts[1].slice(0, 2);
        }
        
        e.target.value = value;
        
        // Validación
        if (!/^\d+([.,]\d{0,2})?$/.test(value)) {
            e.target.setCustomValidity('Por favor, ingrese un número válido con hasta 2 decimales');
        } else {
            e.target.setCustomValidity('');
        }
    });
    
    precioInput.addEventListener('blur', function(e) {
        let value = e.target.value;
        // Asegurar que siempre haya dos decimales al perder el foco
        if (value && !value.includes(',') && !value.includes('.')) {
            e.target.value = value + ',00';
        } else if (value.split(/[.,]/)[1]?.length === 1) {
            e.target.value = value + '0';
        }
    });
});


/* nombre de producto*/
document.addEventListener('DOMContentLoaded', function() {
    let nombreInput = document.getElementById('id_nombre');
    let errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.style.color = 'red';
    errorSpan.style.display = 'none';
    nombreInput.parentNode.insertBefore(errorSpan, nombreInput.nextSibling);

    function showError(message) {
        errorSpan.textContent = message;
        errorSpan.style.display = 'block';
    }

    function hideError() {
        errorSpan.style.display = 'none';
    }

    nombreInput.addEventListener('input', function(e) {
        let value = e.target.value;

        // Permitir solo letras, espacios y caracteres acentuados
        value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
        e.target.value = value;

        // Validación
        if (value.trim() === '') {
            showError('El nombre no puede estar vacío.');
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
            showError('Por favor, ingrese solo letras y espacios.');
        } else if (/(.)\1{3,}/.test(value)) {
            showError('El nombre contiene repeticiones excesivas de letras.');
        } else if (value.length < 3) {
            showError('El nombre del producto debe tener al menos 3 caracteres.');
        } else if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(value)) {
            showError('El nombre debe contener al menos una letra.');
        } else {
            hideError();
        }
    });

    // Prevenir el envío del formulario si hay errores
    nombreInput.form.addEventListener('submit', function(e) {
        if (errorSpan.style.display === 'block') {
            e.preventDefault();
            showError('Por favor, corrija los errores antes de enviar el formulario.');
        }
    });
});


// Buscador producto en listar_productos
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('input[type="text"]');
    const tbody = document.querySelector('tbody');
    let timeoutId = null;

    function highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    function filterTable(query) {
        const rows = tbody.querySelectorAll('tr');
        let visibleCount = 0;
    
        // Contar columnas del thead (excluyendo la de acciones)
        const columnCount = document.querySelector('thead tr').cells.length - 1;
        
        if (!query) {
            rows.forEach(row => {
                row.style.display = '';
                row.querySelectorAll('td').forEach((cell, index) => {
                    if (index < columnCount) { 
                        const originalText = cell.getAttribute('data-original-text');
                        if (originalText) {
                            cell.textContent = originalText;
                        }
                    }
                });
            });
            return rows.length;
        }
    
        query = query.toLowerCase();
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let found = false;
    
            cells.forEach((cell, index) => {
                // Solo procesar hasta la penúltima columna
                if (index < columnCount) { 
                    if (!cell.getAttribute('data-original-text')) {
                        cell.setAttribute('data-original-text', cell.textContent);
                    }
                    
                    const content = cell.getAttribute('data-original-text');
                    
                    if (content.toLowerCase().includes(query)) {
                        found = true;
                        cell.innerHTML = highlightText(content, query);
                    } else {
                        cell.textContent = content;
                    }
                }
            });
    
            row.style.display = found ? '' : 'none';
            if (found) visibleCount++;
        });
    
        return visibleCount;
    }

    if (searchInput) {
        // Agregar estilos para el highlight
        const style = document.createElement('style');
        style.textContent = `
            .highlight {
                background-color: rgba(255, 107, 0, 0.3);
                padding: 2px;
                border-radius: 3px;
            }
            #searchCount {
                color: #fff;
                margin-top: 5px;
                font-size: 0.9em;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(style);

        // Evento de búsqueda
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.trim();
            
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            timeoutId = setTimeout(() => {
                const visibleCount = filterTable(query);
                
                // Mostrar contador de resultados
                const countDisplay = document.getElementById('searchCount') || (() => {
                    const div = document.createElement('div');
                    div.id = 'searchCount';
                    searchInput.parentNode.appendChild(div);
                    return div;
                })();

                if (query) {
                    countDisplay.textContent = `${visibleCount} resultado${visibleCount !== 1 ? 's' : ''} encontrado${visibleCount !== 1 ? 's' : ''}`;
                } else {
                    countDisplay.textContent = '';
                }
            }, 300);
        });

        // Limpiar búsqueda con Escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                filterTable('');
                const countDisplay = document.getElementById('searchCount');
                if (countDisplay) countDisplay.textContent = '';
            }
        });

        // Inicializar data-original-text en la carga
        tbody.querySelectorAll('tr').forEach(row => {
            row.querySelectorAll('td').forEach((cell, index) => {
                if (index < 4) { // Solo las primeras 4 columnas
                    cell.setAttribute('data-original-text', cell.textContent);
                }
            });
        });
    }
});



//confirmacion de eliminar productos//
// Inicialización de los botones de eliminar

// Función para inicializar los botones de eliminar
document.addEventListener('DOMContentLoaded', function() {
    // Agregar event listeners a todos los botones de eliminar
    document.querySelectorAll('.btn-eliminarptss').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('href').split('/').slice(-2)[0];
            const stockActual = parseInt(this.getAttribute('data-stock'));
            abrirModalEliminar(productId, stockActual);
        });
    });
});

function abrirModalEliminar(productId, stockActual) {
    const modal = document.getElementById('modalEliminar');
    const mensaje = document.getElementById('mensajeEliminar');
    const btnConfirmar = document.getElementById('btnConfirmar');
    
    if (stockActual > 0) {
        mensaje.textContent = `No se puede eliminar este producto porque tiene ${stockActual} unidades en stock`;
        mensaje.style.color = 'red';
        btnConfirmar.style.display = 'none';
    } else {
        mensaje.textContent = '¿Está seguro que desea eliminar este producto?';
        mensaje.style.color = 'white';
        btnConfirmar.style.display = 'inline-block';
        
        btnConfirmar.onclick = function() {
            // Crear formulario
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/eliminar_producto/${productId}/`;
            
            // Agregar CSRF token
            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
            
            // Enviar formulario
            document.body.appendChild(form);
            form.submit();
        };
    }
    
    modal.style.display = "block";
}

function cerrarModalEliminar() {
    const modal = document.getElementById('modalEliminar');
    modal.style.display = "none";
}

// Cerrar el modal si se hace clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('modalEliminar');
    if (event.target == modal) {
        cerrarModalEliminar();
    }
}


  


  /*estado de venta*/
  function confirmarCambioEstado(selectElement) {
    const nuevoEstado = selectElement.value;
    const estadoActual = '{{ venta.estado }}';
    
    if (nuevoEstado === estadoActual) {
        return;
    }
    
    let mensaje = '';
    if (nuevoEstado === 'pagada') {
        mensaje = '¿Está seguro de marcar esta venta como pagada? Esta acción no se puede deshacer.';
    } else if (nuevoEstado === 'cancelada') {
        mensaje = '¿Está seguro de cancelar esta venta? Esta acción no se puede deshacer.';
    } else {
        mensaje = '¿Está seguro de cambiar el estado de la venta?';
    }
    
    if (confirm(mensaje)) {
        document.getElementById('formEstado').submit();
    } else {
        selectElement.value = estadoActual;
    }
}

// Deshabilitar el formulario si la venta ya está pagada o cancelada
document.addEventListener('DOMContentLoaded', function() {
    const estadoActual = '{{ venta.estado }}';
    if (estadoActual === 'pagada' || estadoActual === 'cancelada') {
        const select = document.querySelector('select[name="estado"]');
        if (select) {
            select.disabled = true;
        }
    }
});






const DELETE_PASSWORD = "1234";

function verificarMostrarModalEliminar(id, nombre, tipo) {
    const modal = document.getElementById('modalDelete');
    const deleteMessage = document.getElementById('deleteMessage');
    const passwordInput = document.getElementById('deletePassword');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');

    // Guardar el ID y tipo como atributos data del botón de confirmación
    btnConfirmDelete.dataset.id = id;
    btnConfirmDelete.dataset.tipo = tipo;
    
    // Actualizar el mensaje
    deleteMessage.textContent = `¿Está seguro que desea eliminar la ${tipo} "${nombre}"?`;

    // Limpiar y enfocar el input de contraseña
    passwordInput.value = '';
    
    // Configurar el botón de eliminar
    btnConfirmDelete.onclick = () => confirmarEliminacion();

    // Mostrar el modal
    modal.style.display = 'block';
    passwordInput.focus();

    // Manejar Enter en el input de contraseña
    passwordInput.onkeypress = (e) => {
        if (e.key === 'Enter') {
            confirmarEliminacion();
        }
    };
}

function confirmarEliminacion() {
    const btnConfirm = document.getElementById('btnConfirmDelete');
    const id = btnConfirm.dataset.id;
    const tipo = btnConfirm.dataset.tipo;
    const password = document.getElementById('deletePassword').value;
    
    if (!id || !tipo) {
        showError('Error: Datos de eliminación no válidos');
        return;
    }

    if (password !== DELETE_PASSWORD) {
        showError('Contraseña incorrecta');
        document.getElementById('deletePassword').value = '';
        document.getElementById('deletePassword').focus();
        return;
    }

    btnConfirm.disabled = true;
    btnConfirm.textContent = 'Eliminando...';

    // Construir URL con el ID
    let url = '';
    switch(tipo) {
        case 'categoria':
            url = `/eliminar_categoria/${id}/`;
            break;
        case 'tamaño':
            url = `/eliminar_tamaño/${id}/`;
            break;
        case 'animal':
            url = `/eliminar_animal/${id}/`;
            break;
        case 'edad':
            url = `/eliminar_edad/${id}/`;
            break;
        case 'consistencia':
            url = `/eliminar_consistencia/${id}/`;
            break;
        case 'marca':
            url = `/eliminar_marca/${id}/`;
            break;
        default:
            url = `/eliminar_${tipo}/${id}/`;
    }

    // Log para debugging
    console.log('URL a enviar:', url);
    console.log('ID:', id);
    console.log('Tipo:', tipo);

    fetch(url, {
        method: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
    .then(response => {
        console.log('Status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            showError(data.error);
            btnConfirm.disabled = false;
            btnConfirm.textContent = 'Eliminar';
        } else {
            window.location.reload();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        showError('Error al procesar la solicitud');
        btnConfirm.disabled = false;
        btnConfirm.textContent = 'Eliminar';
    });
}

function closeModal() {
    const modal = document.getElementById('modalDelete');
    modal.style.display = 'none';
    document.getElementById('deletePassword').value = '';
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) errorMessage.remove();
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const modalContent = document.querySelector('.modal-content');
    const existingError = modalContent.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    modalContent.insertBefore(errorDiv, modalContent.firstChild);
}

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
    const modal = document.getElementById('modalDelete');
    if (event.target === modal) {
        closeModal();
    }
};

// Cerrar modal con Escape
document.onkeydown = function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
};


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formEmpleado');
    const campos = {
        username: document.getElementById('username'),
        password: document.getElementById('password'),
        nombre: document.getElementById('nombre'),
        apellido: document.getElementById('apellido'),
        telefono: document.getElementById('telefono'),
        direccion: document.getElementById('direccion')
    };

    // Función para mostrar errores
    function mostrarError(elemento, mensaje) {
        elemento.classList.add('campo-error');
        const errorDiv = elemento.parentElement.querySelector('.error-mensaje');
        errorDiv.textContent = mensaje;
    }

    // Función para limpiar errores
    function limpiarError(elemento) {
        elemento.classList.remove('campo-error');
        elemento.parentElement.querySelector('.error-mensaje').textContent = '';
    }

    // Función para capitalizar palabras
    function capitalizarPalabras(texto) {
        return texto.toLowerCase().split(' ')
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(' ');
    }

    // Validaciones en tiempo real
    campos.username.addEventListener('input', function(e) {
        const valor = e.target.value;
        if (!/^[a-zA-Z0-9]*$/.test(valor)) {
            e.target.value = valor.replace(/[^a-zA-Z0-9]/g, '');
            mostrarError(e.target, 'Solo se permiten letras y números');
        } else if (valor.length > 12) {
            e.target.value = valor.slice(0, 12);
            mostrarError(e.target, 'Máximo 12 caracteres');
        } else {
            limpiarError(e.target);
        }
    });

    campos.password.addEventListener('input', function(e) {
        const valor = e.target.value;
        if (!/^[a-zA-Z0-9]*$/.test(valor)) {
            e.target.value = valor.replace(/[^a-zA-Z0-9]/g, '');
            mostrarError(e.target, 'Solo se permiten letras y números');
        } else if (valor.length > 14) {
            e.target.value = valor.slice(0, 14);
            mostrarError(e.target, 'Máximo 14 caracteres');
        } else if (valor.length < 6) {
            mostrarError(e.target, 'Mínimo 6 caracteres');
        } else {
            limpiarError(e.target);
        }
    });

    campos.telefono.addEventListener('input', function(e) {
        const valor = e.target.value;
        if (!/^[0-9]*$/.test(valor)) {
            e.target.value = valor.replace(/[^0-9]/g, '');
            mostrarError(e.target, 'Solo se permiten números');
        } else if (valor.length !== 10 && valor.length > 0) {
            mostrarError(e.target, 'Debe tener 10 dígitos');
        } else {
            limpiarError(e.target);
        }
    });

    // Validación para dirección con capitalización
    campos.direccion.addEventListener('input', function(e) {
        let valor = e.target.value;
        
        // Validar caracteres permitidos
        if (!/^[a-zA-Z0-9\s]*$/.test(valor)) {
            valor = valor.replace(/[^a-zA-Z0-9\s]/g, '');
            mostrarError(e.target, 'Solo se permiten letras y números');
        }

        // Capitalizar palabras
        valor = capitalizarPalabras(valor);
        e.target.value = valor;

        // Validar que contenga letras y números
        const tieneLetras = /[a-zA-Z]/.test(valor);
        const tieneNumeros = /[0-9]/.test(valor);
        
        if (!tieneLetras || !tieneNumeros) {
            mostrarError(e.target, 'Debe contener tanto letras como números');
        } else {
            limpiarError(e.target);
        }
    });

    // Validación y capitalización para nombre y apellido
    [campos.nombre, campos.apellido].forEach(campo => {
        campo.addEventListener('input', function(e) {
            let valor = e.target.value;
            
            // Remover caracteres que no sean letras o espacios
            if (!/^[a-zA-Z\s]*$/.test(valor)) {
                valor = valor.replace(/[^a-zA-Z\s]/g, '');
                mostrarError(e.target, 'Solo se permiten letras');
            } else {
                limpiarError(e.target);
            }
            
            // Capitalizar palabras
            e.target.value = capitalizarPalabras(valor);
        });
    });

    // Validación del formulario
    form.addEventListener('submit', function(e) {
        let hayErrores = false;

        // Validar username
        if (campos.username.value.length < 1) {
            mostrarError(campos.username, 'El usuario es requerido');
            hayErrores = true;
        }

        // Validar password
        if (campos.password.value.length < 6) {
            mostrarError(campos.password, 'La contraseña debe tener al menos 6 caracteres');
            hayErrores = true;
        }

        // Validar teléfono
        if (campos.telefono.value.length !== 10) {
            mostrarError(campos.telefono, 'El teléfono debe tener 10 dígitos');
            hayErrores = true;
        }

        // Validar nombre y apellido
        [campos.nombre, campos.apellido].forEach(campo => {
            if (!/^[a-zA-Z\s]+$/.test(campo.value)) {
                mostrarError(campo, 'Solo se permiten letras');
                hayErrores = true;
            }
            if (campo.value.trim().length === 0) {
                mostrarError(campo, 'Este campo es requerido');
                hayErrores = true;
            }
        });

        // Validar dirección
        const direccionValor = campos.direccion.value;
        const tieneLetras = /[a-zA-Z]/.test(direccionValor);
        const tieneNumeros = /[0-9]/.test(direccionValor);
        
        if (!tieneLetras || !tieneNumeros) {
            mostrarError(campos.direccion, 'La dirección debe contener tanto letras como números');
            hayErrores = true;
        }

        if (hayErrores) {
            e.preventDefault();
        }
    });
});


function abrirModalBorrarEmp(empleadoId, nombreEmpleado) {
    const modal = document.getElementById('modalBorrarEmpleado');
    const spanNombre = document.getElementById('nombreEmpleadoBorrar');
    const form = document.getElementById('formBorrarEmpleado');
    
    spanNombre.textContent = nombreEmpleado;
    form.action = `/eliminar-empleado/${empleadoId}`;
    
    modal.style.display = 'block';
    
    setTimeout(() => {
        modal.classList.add('mostrar-modal-emp');
    }, 10);
}

function cerrarModalBorrarEmp() {
    const modal = document.getElementById('modalBorrarEmpleado');
    modal.classList.remove('mostrar-modal-emp');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

window.onclick = function(event) {
    const modal = document.getElementById('modalBorrarEmpleado');
    if (event.target == modal) {
        cerrarModalBorrarEmp();
    }
}
// ================== VARIABLES GLOBALES ==================
let allProducts = [];
let currentPage = 1;
const productsPerPage = 5;
let animalSeleccionado = '';
let carritoTemporal = {};
let ventaPreviamenteGuardada = false;
let modalAbierto = false;
let userInteracted = false;
let accionIntencional = false;


// ================== INICIALIZACIÓN ==================
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Lucide
    lucide.createIcons();

    // Inicializar botones de animales
    const animalButtons = document.querySelectorAll('.animal-buttons button');
    animalButtons.forEach(button => {
        button.addEventListener('click', function() {
            animalButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            mostrarCategorias(this.innerText);
        });
    });

    // Configurar búsqueda de productos
    const buscarProductoInput = document.getElementById('buscar-producto');
    if (buscarProductoInput) {
        let timeoutId;
        buscarProductoInput.addEventListener('input', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                buscarProductos(this.value);
            }, 300);
        });
    }

    // Configurar paginación
    document.getElementById('prev-page')?.addEventListener('click', () => {
        if (currentPage > 1) showProductsForPage(currentPage - 1);
    });

    document.getElementById('next-page')?.addEventListener('click', () => {
        const totalPages = Math.ceil(allProducts.length / productsPerPage);
        if (currentPage < totalPages) showProductsForPage(currentPage + 1);
    });

    // Ocultar categorías al inicio
    document.getElementById('categorias-productos').style.display = 'none';

    // Configurar modales y eventos de ventana
    configurarModalesYEventos();
});

// ================== CONFIGURACIÓN DE MODALES Y EVENTOS ==================
function configurarModalesYEventos() {
    // Configurar modal de suelto
    const sueltoModal = document.getElementById('modalSuelto');
    const closeSueltoModalBtn = document.getElementById('closeSueltoModal');
    if (closeSueltoModalBtn) {
        closeSueltoModalBtn.onclick = () => sueltoModal.style.display = 'none';
    }

    // Configurar modal de confirmación de venta
    const modalVenta = document.getElementById('modal-confirmacion-venta');
    const cerrarBtn = document.querySelector('.cerrar-modal-v');
    const aceptarBtn = document.querySelector('.boton-aceptar-v');

    if (cerrarBtn) cerrarBtn.onclick = cerrarModalVenta;
    if (aceptarBtn) aceptarBtn.onclick = cerrarModalVenta;

    // Configurar modal de cierre de caja
    configurarModalCierreCaja();

    // Eventos de ventana
    window.onclick = function(event) {
        if (event.target.classList.contains('modalsA')) {
            event.target.style.display = 'none';
        }
    };

    // Prevenir navegación hacia atrás
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
        window.history.pushState(null, "", window.location.href);
        alert("No se puede salir, primero cierre sesión.");
    };

    // Manejar interacción del usuario
    window.addEventListener('click', () => userInteracted = true);
    window.addEventListener('keydown', () => userInteracted = true);

    // Advertencia al cerrar ventana
    window.onbeforeunload = function(event) {
        if (accionIntencional) return undefined;
        if (userInteracted) {
            const message = "Estás a punto de salir de la página. ¿Estás seguro?";
            event.returnValue = message;
            return message;
        }
    };
}

// ================== MANEJO DE PRODUCTOS Y CATEGORÍAS ==================
function mostrarCategorias(animal) {
    console.log('Mostrando categorías para:', animal);
    
    // Limpiar selecciones previas y restablecer estados
    const categoriasContainer = document.getElementById('categorias-productos');
    const edadesContainer = document.getElementById('edades-container');
    
    // Limpiar selecciones previas
    document.querySelectorAll('.animal-buttons button').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.querySelectorAll('#categorias-productos button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Limpiar contenedor de edades y remover botón SUELTO
    edadesContainer.innerHTML = '';
    edadesContainer.style.display = 'none';
    
    // Actualizar animal seleccionado y mostrar categorías
    animalSeleccionado = animal;
    categoriasContainer.style.display = 'flex';
    
    // Resaltar el botón del animal seleccionado
    const botonAnimal = Array.from(document.querySelectorAll('.animal-buttons button'))
                            .find(btn => btn.textContent === animal);
    if (botonAnimal) {
        botonAnimal.classList.add('selected');
    }

    // Definir las edades para cada animal
    const edadesPorAnimal = {
        'PERRO': ['Cachorro', 'Adulto'],
        'GATO': ['Gatito', 'Adulto'],
        'VACA': [], 
        'CABALLO': [], 
        'AVE': [
            'Bebe o pre iniciador',
            'Recria o iniciador',
            'Engorde o terminador',
            'Alta postura'
        ],
        'VARIOS': [] 
    };

    // Configurar botones de categoría
    const buttons = categoriasContainer.querySelectorAll('button');
    buttons.forEach(button => {
        button.onclick = function() {
            // Limpiar selecciones previas de categorías
            categoriasContainer.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            this.classList.add('selected');
            
            if (this.innerText === 'ALIMENTO') {
                edadesContainer.innerHTML = ''; // Limpiar edades anteriores
                const edades = edadesPorAnimal[animal] || [];
                
                if (edades.length > 0) {
                    edades.forEach(edad => {
                        const btn = document.createElement('button');
                        btn.className = 'btn-category';
                        btn.textContent = edad;
                        btn.onclick = () => {
                            // Limpiar selecciones previas de edades y suelto
                            edadesContainer.querySelectorAll('button').forEach(b => {
                                b.classList.remove('selected');
                            });
                            
                            // Eliminar botón SUELTO existente si hay
                            const existingSueltoBtn = edadesContainer.querySelector('.suelto-btn');
                            if (existingSueltoBtn) {
                                existingSueltoBtn.remove();
                            }
                            
                            // Resaltar edad seleccionada
                            btn.classList.add('selected');
                            filtrarProductosPorEdad(animal, edad);
                            
                            // Agregar nuevo botón SUELTO solo para ALIMENTO
                            const sueltoBtn = document.createElement('button');
                            sueltoBtn.className = 'btn-category suelto-btn';
                            sueltoBtn.textContent = 'SUELTO';
                            sueltoBtn.onclick = (e) => {
                                e.stopPropagation();
                                sueltoBtn.classList.add('selected');
                                mostrarOpcionesSuelto(animal, edad);
                            };
                            edadesContainer.appendChild(sueltoBtn);
                        };
                        edadesContainer.appendChild(btn);
                    });
                    edadesContainer.style.display = 'flex';
                } else {
                    const sueltoBtn = document.createElement('button');
                    sueltoBtn.className = 'btn-category suelto-btn';
                    sueltoBtn.textContent = 'SUELTO';
                    sueltoBtn.onclick = () => {
                        sueltoBtn.classList.add('selected');
                        mostrarOpcionesSuelto(animal);
                    };
                    edadesContainer.innerHTML = '';
                    edadesContainer.appendChild(sueltoBtn);
                    edadesContainer.style.display = 'flex';
                    mostrarProductos(animal, 'ALIMENTO');
                }
            } else {
                edadesContainer.style.display = 'none';
                edadesContainer.innerHTML = '';
                mostrarProductos(animal, this.innerText);
            }
        };
    });
}
// Agrega colores a los botones seleccionados
document.head.insertAdjacentHTML('beforeend', `
<style>
.selected {
    background-color: #ff8c00 !important;
    color: white !important;
}
.suelto-btn {
    margin-left: 10px;
}
</style>
`);
function filtrarProductosPorEdad(animal, edad) {
    console.log(`Filtrando productos para ${animal} con edad ${edad}`);
    

    let url = `/obtener_productos/?animal=${animal}&categoria=ALIMENTO&edad=${edad}`;
    
    fetch(url)
        .then(response => response.json())
        .then(productos => {
            console.log('Productos filtrados recibidos:', productos);
            if (productos && productos.length > 0) {
                allProducts = productos;
                mostrarListaProductos(productos);
            } else {
                const listaProductos = document.getElementById('lista-productos');
                listaProductos.innerHTML = '<li>No se encontraron productos para esta selección</li>';
            }
            document.getElementById('productos-mostrar').style.display = 'block';
        })
        .catch(error => {
            console.error('Error al filtrar productos:', error);
            document.getElementById('lista-productos').innerHTML = 
                '<li>Error al cargar los productos</li>';
        });
}



function mostrarProductos(animal, categoria, edad = null) {
    console.log('Intentando mostrar productos:', { animal, categoria, edad });
    const listaProductos = document.getElementById('lista-productos');
    
    if (!listaProductos) {
        console.error('Elemento lista-productos no encontrado');
        return;
    }
    
    listaProductos.innerHTML = '<li>Cargando productos...</li>';
    
   
    let url = `/obtener_productos/?animal=${encodeURIComponent(animal)}&categoria=${encodeURIComponent(categoria)}`;
    if (edad) {
        url += `&edad=${encodeURIComponent(edad)}`;
    }
    
    console.log('Haciendo fetch a:', url);
    
    fetch(url)
        .then(response => {
            console.log('Respuesta recibida:', response.status);
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(productos => {
            console.log('Productos recibidos:', productos);
            allProducts = productos;
            showProductsForPage(1);
            document.getElementById('productos-mostrar').style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
            listaProductos.innerHTML = `<li>Error al cargar productos: ${error.message}</li>`;
        });
}

function mostrarProductosPorEdad(animal, edad) {
    console.log(`Mostrando productos para ${animal} con edad ${edad}`);
    
  
    document.querySelectorAll('#edades-container button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
  
    event.target.classList.add('selected');
    
    // Construir la URL con los parámetros
    let url = `/obtener_productos/?animal=${encodeURIComponent(animal)}&categoria=ALIMENTO&edad=${encodeURIComponent(edad)}`;
    
    console.log('Haciendo petición a:', url);
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(productos => {
            console.log('Productos recibidos:', productos);
            allProducts = productos;
            showProductsForPage(1);
            document.getElementById('productos-mostrar').style.display = 'block';
        })
        .catch(error => {
            console.error('Error al cargar productos:', error);
            document.getElementById('lista-productos').innerHTML = 
                `<li style="color: red;">Error al cargar productos: ${error.message}</li>`;
        });
}


function buscarProductos(query) {
    const searchQuery = query.toLowerCase().trim();
    const listaProductos = document.getElementById('lista-productos');
    
    if (!listaProductos) return;

    if (!searchQuery) {
        showProductsForPage(1);
        return;
    }

    // Filtrar productos por búsqueda y stock mayor a 0
    const productosFiltrados = allProducts.filter(producto => {
        // Primero verificar stock
        if (producto.stock <= 0) return false;

        // Luego realizar la búsqueda
        const searchableText = [
            producto.nombre,
            producto.marca,
            producto.peso,
            producto.categoria,
            producto.animal,
            (producto.peso ? producto.peso.toString() : '')
        ].filter(Boolean).join(' ').toLowerCase();

        return searchQuery.split(' ').every(term => searchableText.includes(term));
    });

    mostrarListaProductos(productosFiltrados);
}

// ================== VISUALIZACIÓN DE PRODUCTOS ==================
function mostrarListaProductos(productos) {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    productos.forEach(producto => {
        const li = document.createElement('li');
        li.className = 'producto-item';
        li.style.cssText = `
            cursor: pointer;
            padding: 10px;
            background-color: #333333;
            margin-bottom: 5px;
            border-radius: 5px;
            transition: background-color 0.3s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        // Create container for product info
        const productInfo = document.createElement('div');
        
        // Construir el texto completo del producto con el nuevo orden
        let nombreMostrar = '';
        
        // Agregar marca si existe
        if (producto.marca && producto.marca !== 'null' && producto.marca !== 'undefined') {
            nombreMostrar += `${producto.marca} - `;
        }
        
        // Agregar nombre del producto
        nombreMostrar += producto.nombre;
        
        // Agregar edad si existe (ahora primero)
        if (producto.edad && producto.edad !== 'null' && producto.edad !== 'undefined') {
            nombreMostrar += ` - ${producto.edad}`;
        }
        
        // Agregar tamaño si existe (ahora después de la edad)
        if (producto.tamaño && producto.tamaño !== 'null' && producto.tamaño !== 'undefined') {
            nombreMostrar += ` - ${producto.tamaño}`;
        }
        
        // Agregar peso
        if (producto.peso) {
            nombreMostrar += ` - ${producto.peso}`;
        }
        if (producto.obs) {
            nombreMostrar += ` - ${producto.obs}`;
        }
        
        // Agregar precio
        nombreMostrar += ` - $${producto.precio.toFixed(2)}`;
        
        productInfo.innerText = nombreMostrar;
        
        // Create stock info element
        const stockInfo = document.createElement('div');
        stockInfo.style.cssText = `
            background-color: #444;
            padding: 4px 8px;
            border-radius: 4px;
            margin-left: 10px;
            color: ${producto.stock > 10 ? '#4CAF50' : '#FFA500'};
            font-weight: bold;
        `;
        stockInfo.innerText = `Stock: ${producto.stock}`;
        
        // Add elements to li
        li.appendChild(productInfo);
        li.appendChild(stockInfo);
        
        li.onclick = () => agregarProductoAVenta(producto);
        listaProductos.appendChild(li);
    });
}

// Add styles to head
document.head.insertAdjacentHTML('beforeend', `
<style>
.producto-item {
    color: white !important;
    transition: all 0.3s ease;
}

.producto-item:hover {
    background-color: #444444 !important;
    transform: translateX(5px);
}
</style>
`);

function actualizarContadorResultados(cantidad) {
    const contador = document.querySelector('.resultados-count');
    if (contador) {
        contador.textContent = `${cantidad} resultado${cantidad !== 1 ? 's' : ''} encontrado${cantidad !== 1 ? 's' : ''}`;
    }
}

// ================== PAGINACIÓN ==================
function showProductsForPage(page) {
    console.log('Mostrando página:', page);
    console.log('Productos disponibles:', allProducts);
    
    if (!allProducts || !allProducts.length) {
        console.log('No hay productos para mostrar');
        return;
    }
    const productsPerPage=5;
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = allProducts.slice(startIndex, endIndex);
    
    console.log('Productos a mostrar:', productsToShow);
    
    mostrarListaProductos(productsToShow);
    currentPage = page;
    
    updatePagination();
}
function updatePagination() {
    const totalPages = Math.ceil(allProducts.length / productsPerPage);
    
    document.getElementById('current-page').textContent = currentPage;
    document.getElementById('total-pages').textContent = totalPages;
    
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}

// ================== MANEJO DEL CARRITO ==================

function agregarProductoAVenta(producto, esSuelto = false) {
    console.log('Producto a agregar:', producto);
    
    if (!producto) {
        console.error('Producto inválido');
        return;
    }

    const productoId = esSuelto ? `suelto-${producto.id}-${producto.bolsa_id}` : producto.id.toString();

    if (carritoTemporal[productoId]) {
        if (!esSuelto) {
            if (carritoTemporal[productoId].cantidad < producto.stock) {
                carritoTemporal[productoId].cantidad++;
                actualizarVistaCarrito();
            } else {
                mostrarMensaje("No hay suficiente stock disponible.", "error");
            }
        } else {
            mostrarMensaje("Este producto suelto ya está en el carrito.", "error");
        }
    } else {
        try {
            carritoTemporal[productoId] = {
                ...producto,
                id: producto.id,
                carritoId: productoId,
                cantidad: 1,
                esSuelto: esSuelto,
                es_suelto: esSuelto,
                bolsa_id: producto.bolsa_id,
                monto_venta: parseFloat(producto.monto_venta || producto.precio),
                precio: parseFloat(producto.precio || producto.monto_venta),
                nombre: producto.nombre,
                marca: producto.marca || '',
                edad: producto.edad || '',
                tamaño: producto.tamaño || '',
                
            };
            
            actualizarVistaCarrito();
            
        } catch (error) {
            console.error('Error al agregar producto:', error);
            mostrarMensaje("Error al agregar el producto al carrito", "error");
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {

});

function actualizarVistaCarrito() {
    const tablaVenta = document.getElementById('productos-venta');
    if (!tablaVenta) {
        console.error('No se encontró la tabla de venta');
        return;
    }
    
    tablaVenta.innerHTML = '';
    
    for (const [carritoId, item] of Object.entries(carritoTemporal)) {
        const fila = tablaVenta.insertRow();
        fila.dataset.productoId = carritoId;
        
        // Para productos sueltos
        if (item.esSuelto || item.es_suelto) {
            // Construir el nombre completo para productos sueltos
            let nombreCompleto = [];
            
            // Agregar marca y nombre base
            if (item.marca) nombreCompleto.push(item.marca);
            if (item.nombre) nombreCompleto.push(item.nombre);
            
            // Agregar edad y tamaño si existen
            if (item.edad) nombreCompleto.push(item.edad);
            if (item.tamaño) nombreCompleto.push(item.tamaño);
            
            // Agregar peso si existe
            // if (item.peso && !item.nombre.includes(item.peso)) {
            //     nombreCompleto.push(`${item.peso}kg`);
            // }
            
            // Unir todo y agregar (Suelto) una sola vez
            let nombreFinal = nombreCompleto.join(' - ');
            if (!nombreFinal.includes('(Suelto)')) {
                nombreFinal += ' (Suelto)';
            }
            
            fila.innerHTML = `
                <td>${nombreFinal}</td>
                <td>1</td>
                <td>$${parseFloat(item.monto_venta || item.precio).toFixed(2)}</td>
                <td>$${parseFloat(item.monto_venta || item.precio).toFixed(2)}</td>
                <td>
                    <button onclick="eliminarProductoCarrito('${carritoId}')" class="btn-eliminar">X</button>
                </td>
            `;
        } else {
            // Para productos normales
            const precio = parseFloat(item.precio);
            const cantidad = parseInt(item.cantidad);
            const total = precio * cantidad;
            
            // Construir el nombre completo para productos normales
            let nombreCompleto = [];
            
            if (item.marca) nombreCompleto.push(item.marca);
            if (item.nombre) nombreCompleto.push(item.nombre);
            if (item.edad) nombreCompleto.push(item.edad);
            if (item.tamaño) nombreCompleto.push(item.tamaño);
            if (item.peso) nombreCompleto.push(`${item.peso}kg`);
            
            fila.innerHTML = `
                <td>${nombreCompleto.join(' - ')}</td>
                <td>
                    <input type="number" 
                           value="${cantidad}" 
                           min="1" 
                           max="${item.stock}" 
                           onchange="actualizarCantidadCarrito('${carritoId}', this.value)"
                           style="width: 60px; text-align: center;"
                    />
                </td>
                <td>$${precio.toFixed(2)}</td>
                <td>$${total.toFixed(2)}</td>
                <td>
                    <button onclick="eliminarProductoCarrito('${carritoId}')" class="btn-eliminar">X</button>
                </td>
            `;
        }
    }
    
    actualizarTotal();
}

function eliminarProductoCarrito(carritoId) {
    // eliminama el producto del carrito 
    delete carritoTemporal[carritoId];
    // Actualizamos la vista del carrito
    actualizarVistaCarrito();
}
function devolverMontoABolsa(producto) {
    if (!producto.bolsa_id || !producto.monto_venta) {
        console.error('Producto no tiene bolsa_id o monto_venta');
        return Promise.reject('Datos de producto inválidos');
    }

    return fetch('/devolver_monto_bolsa/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            bolsa_id: producto.bolsa_id,
            monto: parseFloat(producto.monto_venta)
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        if (!data.success) {
            throw new Error(data.error || 'Error al devolver monto a la bolsa');
        }
        return data;
    });
}

function actualizarCantidadCarrito(carritoId, nuevaCantidad) {
    const item = carritoTemporal[carritoId];
    if (!item) return;

    nuevaCantidad = parseInt(nuevaCantidad);
    
    // Solo permitir cambios de cantidad en productos no sueltos
    if (!item.esSuelto && !item.es_suelto) {
        if (nuevaCantidad > 0 && nuevaCantidad <= item.stock) {
            item.cantidad = nuevaCantidad;
            actualizarVistaCarrito();
        } else {
            mostrarMensaje("Cantidad no válida o excede el stock disponible", "error");
            // Restaurar la cantidad anterior
            actualizarVistaCarrito();
        }
    }
}

function actualizarTotal() {
    let subtotal = 0;
    
    Object.values(carritoTemporal).forEach(item => {
        if (item.esSuelto || item.es_suelto) {
            // Para productos sueltos, usar el monto_venta
            subtotal += parseFloat(item.monto_venta || item.precio);
        } else {
            // Para productos normales, multiplicar precio por cantidad
            subtotal += parseFloat(item.precio) * parseInt(item.cantidad);
        }
    });

    // Calcular descuento
    const descuentoPorcentaje = parseInt(document.getElementById('descuento-total').value) || 0;
    const montoDescuento = (subtotal * descuentoPorcentaje) / 100;
    
    // Calcular total final
    const totalFinal = subtotal - montoDescuento;

    // Actualizar 
    document.getElementById('subtotal-amount').textContent = subtotal.toFixed(2);
    document.getElementById('descuento-amount').textContent = montoDescuento.toFixed(2);
    document.getElementById('total-amount').textContent = totalFinal.toFixed(2);

    return {
        subtotal,
        descuento: montoDescuento,
        total: totalFinal
    };
}

// ================== REINICIO Y CANCELACIÓN ==================
function reiniciarVenta() {
    // Limpiar carrito
    carritoTemporal = {};
    actualizarVistaCarrito();

    // Reiniciar campos de formulario
    document.getElementById('descuento-total').value = '0';
    document.getElementById('metodo-pago').value = '';

    // Reiniciar montos
    ['subtotal-amount', 'descuento-amount', 'total-amount'].forEach(id => {
        document.getElementById(id).textContent = '0.00';
    });

    ventaPreviamenteGuardada = false;

    // Limpiar búsqueda y campos
    const buscarProductoInput = document.getElementById('buscar-producto');
    if (buscarProductoInput) buscarProductoInput.value = '';

    // Limpiar todas las selecciones de botones
    const allButtons = document.querySelectorAll('.animal-buttons button, .btn-category, #edades-container button');
    allButtons.forEach(button => {
        button.classList.remove('selected');
        button.disabled = false;
    });

    // Ocultar categorías y edades
    const categoriasProductos = document.getElementById('categorias-productos');
    if (categoriasProductos) {
        categoriasProductos.style.display = 'none';
    }

    const edadesContainer = document.getElementById('edades-container');
    if (edadesContainer) {
        edadesContainer.innerHTML = '';
        edadesContainer.style.display = 'none';
    }

    // Limpiar lista de productos
    const listaProductos = document.getElementById('lista-productos');
    if (listaProductos) listaProductos.innerHTML = '';

    const productosMostrar = document.getElementById('productos-mostrar');
    if (productosMostrar) productosMostrar.style.display = 'none';

    // Resetear variables
    animalSeleccionado = '';
    currentPage = 1;
    allProducts = [];

    if (typeof updatePagination === 'function') updatePagination();

    setTimeout(() => {
        cerrarModalVenta();
    }, 1000);
}

// ================== MANEJO DE BOLSAS ==================
function mostrarOpcionesSuelto(animal, edad = null) {
    if (!animal) return;

    const modalSuelto = document.getElementById('modalSuelto');
    if (!modalSuelto) return;
    
    modalSuelto.style.display = 'block';
    
    const titulo = modalSuelto.querySelector('h2');
    if (titulo) {
        let filtrosTexto = `Opciones de Suelto - ${animal}`;
        if (edad) {
            filtrosTexto += ` - ${edad}`;
        }
        titulo.textContent = filtrosTexto;
    }

    // Configurar los botones con los parámetros correctos
    configurarBotonesModal(animal, edad);
    
    // Mostrar bolsas inmediatamente
    mostrarBolsasAbiertas(animal, edad);
}


function abrirNuevaBolsa(animal, edad) {
    let url = `/obtener_productos_sueltos/?animal=${encodeURIComponent(animal)}`;
    if (edad) {
        url += `&edad=${encodeURIComponent(edad)}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(productos => {
            let listaProductos = document.getElementById('listaBolsasAbiertas');
            listaProductos.innerHTML = '';
            
            if (productos.length === 0) {
                listaProductos.innerHTML = `
                    <li class="producto-item" style="color: orange; padding: 10px;">
                        No hay productos disponibles para apertura de bolsa${edad ? ` de ${edad}` : ''}
                    </li>`;
                return;
            }

            productos.forEach(producto => {
                let li = document.createElement('li');
                li.className = 'producto-item';
                li.style.cssText = `
                    cursor: pointer;
                    padding: 10px;
                    margin: 5px 0;
                    background-color: #333;
                    border-radius: 5px;
                    transition: background-color 0.3s;
                    color: white;
                `;
                
                // Construir el nombre con el mismo formato
                let nombreMostrar = '';
                
                if (producto.marca) {
                    nombreMostrar += producto.marca;
                }
                if (producto.nombre) {
                    nombreMostrar += nombreMostrar ? ` - ${producto.nombre}` : producto.nombre;
                }
                if (producto.edad) {
                    nombreMostrar += ` - ${producto.edad}`;
                }
                if (producto.tamaño) {
                    nombreMostrar += ` - ${producto.tamaño}`;
                }
                if (producto.peso) {
                    nombreMostrar += ` - ${producto.peso}kg`;
                }
                nombreMostrar += ` - $${producto.precio.toFixed(2)}`;
                
                li.textContent = nombreMostrar;
                
                li.onmouseover = () => li.style.backgroundColor = '#444';
                li.onmouseout = () => li.style.backgroundColor = '#333';
                li.onclick = () => seleccionarProductoSuelto(producto.id, animal, edad);
                
                listaProductos.appendChild(li);
            });
        })
        .catch(error => {
            let listaProductos = document.getElementById('listaBolsasAbiertas');
            listaProductos.innerHTML = `
                <li class="producto-item" style="color: orange; padding: 10px;">
                    Error al cargar los productos disponibles
                </li>`;
        });
}
function seleccionarProductoSuelto(productoId, animal, edad) {
    console.log(`Seleccionando producto: ${productoId} para ${animal} - ${edad || 'Sin edad'}`);
    
    fetch('/abrir_bolsa/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            producto_id: productoId,
            animal: animal,
            edad: edad
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Respuesta del servidor:', data);
        
        if (data.success) {
            mostrarMensaje(data.message, 'success');
            mostrarBolsasAbiertas(animal, edad);
        } else {
            if (data.bolsa) {
                mostrarMensaje(`Ya existe una bolsa abierta para este producto. Precio restante: $${data.bolsa.precio_restante}`, 'info');
            } else {
                mostrarMensaje(data.error, 'error');
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error al procesar la solicitud', 'error');
    });
}

// Agregar estilos CSS
document.head.insertAdjacentHTML('beforeend', `
<style>
.producto-item {
    color: white;
    list-style: none;
}

.producto-item:hover {
    background-color: #444 !important;
}

.error-item {
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    background-color: rgba(255, 0, 0, 0.1);
}
</style>
`);

function mostrarBolsasAbiertas(animal, edad = null) {
    let url = `/obtener_bolsas_abiertas/?animal=${encodeURIComponent(animal)}`;
    if (edad) {
        url += `&edad=${encodeURIComponent(edad)}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(bolsas => {
            const listaBolsas = document.getElementById('listaBolsasAbiertas');
            if (!listaBolsas) return;

            listaBolsas.innerHTML = '';
            
            if (bolsas.length === 0) {
                listaBolsas.innerHTML = `
                    <li class="producto-item" style="color: orange;">
                        No hay bolsas abiertas para esta selección
                    </li>`;
                return;
            }

            bolsas.forEach(bolsa => {
                const li = document.createElement('li');
                li.className = 'producto-item';
                li.style.cssText = `
                    cursor: pointer;
                    padding: 10px;
                    margin: 5px 0;
                    background-color: #333;
                    border-radius: 5px;
                    transition: background-color 0.3s;
                    color: white;
                `;
                
                // Usar directamente producto_info que ya viene formateado
                let nombreMostrar = bolsa.producto_info;
                
                // Agregar precio
                nombreMostrar += ` - $${parseFloat(bolsa.precio_restante).toFixed(2)}`;
                
                // Agregar indicador de último 50% si corresponde
                if (bolsa.en_ultimo_50_porciento) {
                    nombreMostrar += ' - Último 50%';
                    li.style.color = '#ff8c00';
                }
                
                li.textContent = nombreMostrar;
                li.onclick = () => seleccionarBolsaAbierta(bolsa.id, bolsa.en_ultimo_50_porciento);
                listaBolsas.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            const listaBolsas = document.getElementById('listaBolsasAbiertas');
            if (listaBolsas) {
                listaBolsas.innerHTML = `
                    <li class="producto-item" style="color: red;">
                        Error al cargar las bolsas
                    </li>`;
            }
        });
}

// Modificar la inicialización de los botones en el modal
function configurarBotonesModal(animal, edad) {
    const btnNuevaBolsa = document.querySelector('button[onclick="abrirNuevaBolsa()"]');
    const btnBolsasAbiertas = document.querySelector('button[onclick="mostrarBolsasAbiertas()"]');

    if (btnNuevaBolsa) {
        btnNuevaBolsa.onclick = function() {
            abrirNuevaBolsa(animal, edad);
        };
    }

    if (btnBolsasAbiertas) {
        btnBolsasAbiertas.onclick = function() {
            mostrarBolsasAbiertas(animal, edad);
        };
    }
}


function seleccionarBolsaAbierta(bolsaId, enUltimo50Porciento) {
    if (enUltimo50Porciento) {
        mostrarModalCierreBolsa(bolsaId);
    } else {
        mostrarVentanaVenta(bolsaId);
    }
}

function mostrarModalCierreBolsa(bolsaId) {
    const modal = document.getElementById('cerrarBolsaModal');
    const aceptarBtn = document.getElementById('aceptarCierreBolsa');
    const cancelarBtn = document.getElementById('cancelarCierreBolsa');

    modal.style.display = 'block';

    aceptarBtn.onclick = function() {
        cerrarBolsa(bolsaId);
        modal.style.display = 'none';
    };

    cancelarBtn.onclick = function() {
        modal.style.display = 'none';
        mostrarVentanaVenta(bolsaId);
    };
}

function cerrarBolsa(bolsaId) {
    fetch('/cerrar_bolsa/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({bolsa_id: bolsaId})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            mostrarMensaje('Bolsa cerrada exitosamente', 'success');
            mostrarBolsasAbiertas();
        } else {
            mostrarMensaje(data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error al cerrar la bolsa', 'error');
    });
}

function mostrarVentanaVenta(bolsaId) {
    const modal = document.getElementById('ventaModal');
    const montoInput = document.getElementById('montoVenta');
    const aceptarBtn = document.getElementById('aceptarVenta');
    const cancelarBtn = document.getElementById('cancelarVenta');

    modal.style.display = 'block';
    montoInput.value = '';

    aceptarBtn.onclick = function() {
        const montoVenta = montoInput.value;
        if (montoVenta === '') return;
        realizarVenta(bolsaId, montoVenta);
        modal.style.display = 'none';
    };

    cancelarBtn.onclick = function() {
        modal.style.display = 'none';
    };
}

function realizarVenta(bolsaId, montoVenta) {
    fetch('/vender_suelto/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({bolsa_id: bolsaId, monto: montoVenta})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            agregarProductoAVenta(data.producto, true);
            mostrarMensaje('Producto suelto agregado a la venta', 'success');
            
            // Cerrar el modal de venta
            document.getElementById('ventaModal').style.display = 'none';
            
            // Cerrar el modal principal de opciones de suelto
            document.getElementById('modalSuelto').style.display = 'none';
            
            // Actualizar la lista de bolsas abiertas en segundo plano
            mostrarBolsasAbiertas();
        } else {
            mostrarMensaje(data.error, 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error al procesar la venta', 'error');
    });
}


// ================== PROCESO DE VENTA ==================
function guardarVenta(pagada = false) {
    if (Object.keys(carritoTemporal).length === 0) {
        mostrarMensaje('No hay productos en la venta', 'error');
        return;
    }

    if (!pagada && hayProductosSueltosEnCarrito()) {
        mostrarMensaje('No se pueden guardar ventas con productos sueltos. Debe completar la venta.', 'error');
        return;
    }

    const metodoPago = document.getElementById('metodo-pago').value;
    if (!metodoPago) {
        mostrarMensaje('Por favor seleccione un método de pago', 'error');
        return;
    }

    const totales = actualizarTotal();
    const productos = Object.values(carritoTemporal).map(item => ({
        id: item.id,
        cantidad: parseFloat(item.cantidad) || 1,
        precio: parseFloat(item.es_suelto ? item.monto_venta : item.precio),
        es_suelto: Boolean(item.es_suelto),
        bolsa_id: item.bolsa_id || null,
        monto_venta: item.monto_venta ? parseFloat(item.monto_venta) : null,
        nombre: item.nombre
    }));

    const datos = {
        productos: productos,
        total_final: totales.total,
        pagada: pagada,
        metodo_pago: metodoPago,
        descuento: parseInt(document.getElementById('descuento-total').value) || 0
    };

    fetch('/ventas/nueva/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Error desconocido');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            const mensajeExito = pagada ? 
                `Venta pagada exitosamente con ${getMetodoPagoTexto(metodoPago)}. ¡Operación completada!` : 
                'Venta guardada exitosamente';
            
            mostrarMensaje(mensajeExito, 'success');
            
            setTimeout(() => {
                reiniciarVenta();
            }, 1000);
        } else {
            throw new Error(data.error || 'Error desconocido');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('Error al procesar la venta: ' + error.message, 'error');
    });
}

function hayProductosSueltosEnCarrito() {
    return Object.values(carritoTemporal).some(item => item.es_suelto);
}

function getMetodoPagoTexto(metodoPago) {
    const metodosTexto = {
        'Efectivo': 'Efectivo',
        'Tarjeta debito': 'Tarjeta de Débito',
        'Transferencia': 'Transferencia'
    };
    return metodosTexto[metodoPago] || metodoPago;
}

// ================== CIERRE DE CAJA ==================
function confirmarCierreCaja() {
    console.log('Iniciando cierre de caja...');
    
    // Obtener el token CSRF
    const csrftoken = getCookie('csrftoken');
    
    fetch(window.location.pathname, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrftoken
        },
        body: new URLSearchParams({
            'cerrar_caja': 'true'
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos del servidor:', data);
        
        if (data.success && data.resumen) {
            const formatearMonto = (monto) => {
                const numero = parseFloat(monto || 0);
                return numero.toLocaleString('es-AR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            };

            // Actualizar cada campo individualmente con verificación
            const montoInicial = document.getElementById('monto-inicial');
            if (montoInicial && data.resumen.monto_inicial !== undefined) {
                console.log('Actualizando monto inicial:', data.resumen.monto_inicial);
                montoInicial.textContent = `$${formatearMonto(data.resumen.monto_inicial)}`;
            }

            const actualizarCampo = (id, valor) => {
                const elemento = document.getElementById(id);
                if (elemento) {
                    console.log(`Actualizando ${id}:`, valor);
                    elemento.textContent = `$${formatearMonto(valor)}`;
                }
            };

            // Actualizar campos restantes
            actualizarCampo('total-efectivo', data.resumen.efectivo);
            actualizarCampo('total-tarjeta', data.resumen.tarjeta_debito);
            actualizarCampo('total-transferencia', data.resumen.transferencia);
            actualizarCampo('total-general', data.resumen.total);

            // Mostrar informe
            const confirmacionInicial = document.getElementById('confirmacion-inicialCjas');
            const informeCierre = document.getElementById('informe-cierre');
            
            if (confirmacionInicial) confirmacionInicial.style.display = 'none';
            if (informeCierre) informeCierre.style.display = 'block';

            // Redireccionar usando la URL proporcionada por el servidor
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        } else {
            console.error('Error en la respuesta:', data);
            alert(data.error || 'Error al cerrar la caja');
        }
    })
    .catch(error => {
        console.error('Error en la petición:', error);
        alert('Error al procesar la solicitud: ' + error.message);
    });
}

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

function actualizarCampo(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        const valorFormateado = parseFloat(valor || 0).toLocaleString('es-AR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        elemento.textContent = `$${valorFormateado}`;
    }
}
// Función para obtener el token CSRF
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

// Función para cerrar el modal de cierre de caja
function cerrarModalCierreCaja() {
    const modal = document.getElementById('modalCierreCaja');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para mostrar el modal de cierre de caja
function mostrarModalCierreCaja() {
    const modal = document.getElementById('modalCierreCaja');
    const confirmacionInicial = document.getElementById('confirmacion-inicialCjas');
    const informeCierre = document.getElementById('informe-cierre');
    
    if (modal) {
        modal.style.display = 'block';
        if (confirmacionInicial) confirmacionInicial.style.display = 'block';
        if (informeCierre) informeCierre.style.display = 'none';
    }
}

// Función para finalizar el cierre
function finalizarCierre() {
    // En lugar de reload(), usar href para ir a inicio
    window.location.href = '/';
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    alert(mensaje); // Puedes reemplazar esto con tu propia implementación de mensajes
}

// ================== FUNCIONES AUXILIARES ==================
function mostrarMensaje(mensaje, tipo = 'success') {
    const modal = document.getElementById('modal-confirmacion-venta');
    const mensajeElement = document.getElementById('mensaje-confirmacion-venta');
    
    if (!modal || !mensajeElement) {
        console.error('Elementos del modal no encontrados');
        return;
    }

    mensajeElement.textContent = mensaje;
    modal.style.display = 'block';
    
    const icono = modal.querySelector('.mensaje-icono');
    if (icono) {
        icono.style.color = tipo === 'success' ? '#28a745' : '#dc3545';
    }
}

function cerrarModalVenta() {
    const modal = document.getElementById('modal-confirmacion-venta');
    if (modal) {
        modal.style.display = 'none';
    }
}

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

// ================== CERRAR BOLSA QUE QUERIA MARIANO ==================

let bolsaIdActual = null;

function abrirModalCierreEspecial(bolsaId) {
    bolsaIdActual = bolsaId;
    document.getElementById('modalCierreEspecial').style.display = 'block';
    document.getElementById('motivoCierre').value = '';
}

function cerrarModalCierreEspecial() {
    document.getElementById('modalCierreEspecial').style.display = 'none';
    bolsaIdActual = null;
}

function confirmarCierreEspecial() {
    const motivo = document.getElementById('motivoCierre').value.trim();
    
    if (!motivo) {
        alert('Por favor, ingrese un motivo para el cierre especial');
        return;
    }
    
    fetch('/cerrar_bolsa_especial/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            bolsa_id: bolsaIdActual,
            motivo: motivo
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Bolsa cerrada exitosamente');
            location.reload();
        } else {
            alert(data.error || 'Error al cerrar la bolsa');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al procesar la solicitud');
    });
    
    cerrarModalCierreEspecial();
}
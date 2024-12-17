function generarNumeroTicket() {
    const fecha = new Date();
    const año = fecha.getFullYear().toString().substr(-2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
    return `${año}${mes}${dia}-${numeroAleatorio}`;
}

function getMetodoPagoTexto(metodoPago) {
    const metodosTexto = {
        'Efectivo': 'Efectivo',
        'Tarjeta debito': 'Tarjeta de Débito',
        'Transferencia': 'Transferencia'
    };
    return metodosTexto[metodoPago] || metodoPago;
}

function imprimirVenta() {
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            body > *:not(.receipt-container) {
                display: none;
            }
            
            .receipt-container {
                width: 80mm;
                padding: 10mm;
                margin: 0;
                font-family: 'Courier New', monospace;
                color: #000 !important;
                background-color: white;
            }
            
            .receipt-container * {
                color: #000 !important;
            }
            
            .receipt-header {
                text-align: center;
                margin-bottom: 5mm;
                border-bottom: 1px dashed #000;
                padding-bottom: 5mm;
            }

            .receipt-header h2 {
                margin: 0;
                padding: 0;
                font-size: 16px;
                font-weight: bold;
            }
            
            .receipt-header p {
                color: #000 !important;
            }
            
            .receipt-info {
                font-size: 12px;
                margin: 3mm 0;
            }

            .receipt-info p {
                color: #000 !important;
                margin: 1mm 0;
            }

            .client-info {
                margin: 3mm 0;
                padding: 2mm 0;
                border-bottom: 1px dashed #000;
                font-size: 12px;
            }
            
            .client-info p {
                color: #000 !important;
                margin: 1mm 0;
            }
            
            .receipt-items {
                width: 100%;
                margin: 5mm 0;
            }
            
            .receipt-items table {
                width: 100%;
                border-collapse: collapse;
                margin: 3mm 0;
            }
            
            .receipt-items td.product-details {
                white-space: pre-line;
                padding: 2mm 1mm;
                line-height: 1.3;
            }
            
            .product-name {
                font-weight: bold;
            }
            .receipt-items th,
            .receipt-items td {
                text-align: left;
                padding: 1mm;
                font-size: 12px;
            }
            
            .receipt-items td:nth-child(2),
            .receipt-items td:nth-child(3),
            .receipt-items td:nth-child(4) {
                text-align: right;
            }
            
            .receipt-summary {
                margin-top: 5mm;
                padding-top: 3mm;
                border-top: 1px dashed #000;
            }
            
            .receipt-summary p {
                text-align: right;
                margin: 1mm 0;
                color: #000 !important;
            }
            
            .receipt-total {
                text-align: right;
                margin-top: 3mm;
                font-weight: bold;
            }

            .receipt-total h3 {
                color: #000 !important;
                margin: 1mm 0;
            }

            .receipt-footer {
                margin-top: 5mm;
                text-align: center;
                font-size: 12px;
                border-top: 1px dashed #000;
                padding-top: 5mm;
            }

            .receipt-footer p {
                color: #000 !important;
                margin: 1mm 0;
            }

            .receipt-contact {
                margin-top: 3mm;
                text-align: center;
                font-size: 11px;
            }
            
            .receipt-contact p {
                color: #000 !important;
                margin: 1mm 0;
            }
        }
    `;
    document.head.appendChild(style);

    const receiptContainer = document.createElement('div');
    receiptContainer.className = 'receipt-container';

    const fecha = new Date().toLocaleDateString();
    const hora = new Date().toLocaleTimeString();
    const metodoPago = document.getElementById('metodo-pago').value;
    const descuentoTotal = document.getElementById('descuento-total').value;
    const totalFinal = document.getElementById('total-amount').textContent;

    receiptContainer.innerHTML = `
        <div class="receipt-header">
            <h2>La Herradura Forrajería</h2>
            <p>Av. Hipólito Yrigoyen 550</p>
            <p style="font-size: 11px;">IVA RESPONSABLE INSCRIPTO</p>
        </div>
        <div class="client-info">
            <p>Ticket Consumidor Final</p>
            <p>Condición frente al IVA: Consumidor Final</p>
        </div>
        <div class="receipt-info">
            <p>Fecha: ${fecha}</p>
            <p>Hora: ${hora}</p>
            <p>Ticket N°: ${generarNumeroTicket()}</p>
            <p>Método de Pago: ${getMetodoPagoTexto(metodoPago)}</p>
        </div>
            <div class="receipt-items">
                <table>
                    <tr>
                        <th>Producto</th>
                        <th>Cant</th>
                        <th>Precio</th>
                        <th>Total</th>
                    </tr>
                    ${Object.values(carritoTemporal).map(item => {
                        if (item.esSuelto) {
                            return `
                                <tr>
                                    <td class="product-details">${item.nombre}</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>$${item.monto_venta.toFixed(2)}</td>
                                </tr>
                            `;
                        } else {
                            // Construir el detalle del producto en múltiples líneas
                            let productDetails = [];
                            productDetails.push(item.marca); // Marca en la primera línea
                            productDetails.push(item.nombre); // Nombre en la segunda línea
                            
                            if (item.peso && item.peso !== 'N/A') {
                                productDetails.push(item.peso); // Peso en la tercera línea si existe
                            }
                            
                            if (item.obs) {
                                productDetails.push(item.obs); // Observaciones en la última línea si existen
                            }
                            
                            return `
                                <tr>
                                    <td class="product-details">${productDetails.join('\n')}</td>
                                    <td>${item.cantidad}</td>
                                    <td>$${item.precio.toFixed(2)}</td>
                                    <td>$${(item.precio * item.cantidad).toFixed(2)}</td>
                                </tr>
                            `;
                        }
                    }).join('')}
                </table>
            </div>
        </div>

        <div class="receipt-summary">
            <p>Subtotal: $${document.getElementById('subtotal-amount').textContent}</p>
            ${descuentoTotal > 0 ? `
                <p>Descuento (${descuentoTotal}%): $${document.getElementById('descuento-amount').textContent}</p>
            ` : ''}
            <div class="receipt-total">
                <h3>Total Final: $${totalFinal}</h3>
            </div>
        </div>
        <div class="receipt-footer">
            <p>¡Gracias por su compra!</p>
            <p>Lo esperamos nuevamente</p>
            <div class="receipt-contact">
                <p>Tel: (XXX) XXXX-XXXX</p>
                <p style="font-size: 10px;">CF - DGI</p>
            </div>
        </div>
    `;

    document.body.appendChild(receiptContainer);
    window.print();

    setTimeout(() => {
        document.body.removeChild(receiptContainer);
        document.head.removeChild(style);
    }, 1000);
}
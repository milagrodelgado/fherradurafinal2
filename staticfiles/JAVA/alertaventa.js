// Archivo: static/JAVA/alertaventa.js
const SalesAlertSystem = {
    init() {
        this.addStyles();
        this.startSalesCheck();
        this.setupAudio();
        this.setupClickHandlers();
        this.createModal();
        
        console.log('Sistema de alertas de ventas inicializado');
    },

    createModal() {
        // Crear el modal si no existe
        if (!document.getElementById('ventasPendientesModal')) {
            const modalHTML = `
                <div id="ventasPendientesModal" class="sales-modal">
                    <div class="sales-modal-content">
                        <div class="sales-modal-header">
                            <h4>Ventas Pendientes</h4>
                            <span class="close-modal">&times;</span>
                        </div>
                        <div class="sales-modal-body">
                            <div class="table-container"></div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            // Agregar evento para cerrar
            const closeBtn = document.querySelector('.close-modal');
            const modal = document.getElementById('ventasPendientesModal');
            
            closeBtn.onclick = () => {
                modal.style.display = 'none';
            };

            window.onclick = (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            };
        }
    },

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .sales-container {
                position: relative;
                display: inline-block;
                margin-top: 35px;
                margin-right: 20px;
                cursor: pointer;
            }

            #sales-icon {
                transition: color 0.3s ease;
                color: orange;
            }

            #sales-icon.warning {
                color: #ffd700 !important;
            }

            .sales-count {
                position: absolute;
                top: -8px;
                right: -8px;
                background-color: #ff4444;
                color: white;
                border-radius: 50%;
                padding: 2px 6px;
                font-size: 12px;
                min-width: 16px;
                text-align: center;
            }

            .sales-modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            }

            .sales-modal-content {
                background-color: #1a1a1a;
                margin: 5% auto;
                padding: 20px;
                border: 1px solid #ff8605;
                width: 90%;
                max-width: 1000px;
                border-radius: 8px;
                color: white;
            }

            .sales-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 1px solid #ff8605;
            }

            .close-modal {
                color: #ff8605;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
            }

            .close-modal:hover {
                color: #ff6b00;
            }

            .table-container {
                overflow-x: auto;
            }

            .sales-table {
                width: 100%;
                border-collapse: collapse;
            }

            .sales-table th,
            .sales-table td {
                padding: 12px;
                text-align: left;
                border-bottom: 1px solid #333;
            }

            .sales-table th {
                background-color: #ff8605;
                color: white;
            }

            .sales-table tr:hover {
                background-color: #2a2a2a;
            }

            .btn-detalles {
                background-color: #ff8605;
                color: white;
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                text-decoration: none;
            }

            .btn-detalles:hover {
                background-color: #ff6b00;
            }
        `;
        document.head.appendChild(style);
    },

    setupClickHandlers() {
        document.addEventListener('click', (e) => {
            const salesContainer = e.target.closest('.sales-container');
            if (salesContainer) {
                this.loadPendingSales();
            }
        });
    },

    loadPendingSales() {
        const modal = document.getElementById('ventasPendientesModal');
        const tableContainer = modal.querySelector('.table-container');
        
        fetch('/ventas/pendientes/')
            .then(response => response.text())
            .then(html => {
                // Extraer solo la tabla del HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const table = doc.querySelector('.table-venta');
                
                if (table) {
                    tableContainer.innerHTML = '';
                    tableContainer.appendChild(table);
                }
                
                modal.style.display = 'block';
            })
            .catch(error => {
                console.error('Error al cargar ventas pendientes:', error);
            });
    },

    setupAudio() {
        this.alertSound = new Audio('data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/+7DEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAARAAAh+QANDRISFxccHCEhJiYrKzAwNTU6Oj8/RERJSU5OU1NYWENDSEhNTVJSV1dcXGFhZmZra3BwdXV6en9/REREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREf/zUMRbAAAGkAKAAAAAABYjgAACGkQZJITmxwYwDcCCAJABUB8H8Pn/iAMEQJBAGCQR/lE/+KA+D6ggQIIECGf/5c4IEMQOIECBAn//+sAQQgQIECYP///+UEYCBAhzggUIP////8oEEAYBhAg4QBgQKAoD4IAgCAIA+CAIAgj//OCPggCAMEgQBA7y5//5c4g+BAEDgMAgCB///1KAgQQAIAj6lE//5c6gNBQgkhAFAYP///+pzgSAkhiAMFAYP////wsDQEAKAwIUBTq///KHOCBQYghBAYDDP///+XBQYWQCAEgbB8H8Pn//gGBwOlxhhIAEexhMFmXoHUTEIhK8LAIBgClAJAOgOAKAFzCEAcAwBEuAOAwAQjCxDAQEwgWGdRwuiGNJK0LEgG4TADiUEYZg8B4qCQgYTgRGKPxNAUgYcAHGBgCKGCEDRqJ0Eh2QJGCu7rmFcAKGFgkX2ThBDIMWGHDCWBZNEgKtAoARZcmCAzBGrUXkNtGxpvkKQSQgxwYCQRggGwBRoIhQo4TGNgUxgPMxcxOKA4cB7BwNDWGAIYSGWFMPFxdkyDR7E5ISGGgIXCEsxkJLqWFpU1RFHQkuC0UpPRCyY8cJwJDghDQUDoOTBAATEEUTEiEzRKVGI5hBAhigYYQFGAhBgcGYGAmDgZjCGChBpVm5KBNwFSVxCpUXFZBJeXUAgOABGBQUPAEVU2ExgxBDGgNxcSCxbZNBgsaxQPtbX5IVwRBYKBEkRiWgpIiMXSJopelEWhDN1bWXBEhF0tKXBrOEPCxTLkYQhJxbLxAksAkzDRjbGE6BUuEQEHyZJ63XWFX5q////+aqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7UMR5A8AAAf4cAAAAAAA0g4AABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
        this.alertSound.volume = 0.5;
    },

    checkPendingSales() {
        fetch('/ventas/verif_pendientes/')
            .then(response => response.json())
            .then(data => {
                if (data.count > 0) {
                    const salesContainer = document.querySelector('.sales-container');
                    if (salesContainer) {
                        let salesIcon = salesContainer.querySelector('[data-lucide="shopping-cart"]');
                        if (!salesIcon) {
                            salesIcon = document.createElement('i');
                            salesIcon.setAttribute('data-lucide', 'shopping-cart');
                            salesIcon.id = 'sales-icon';
                            salesContainer.appendChild(salesIcon);
                            lucide.createIcons();
                        }
                        salesIcon.classList.add('warning');

                        let countElement = salesContainer.querySelector('.sales-count');
                        if (!countElement) {
                            countElement = document.createElement('span');
                            countElement.className = 'sales-count';
                            salesContainer.appendChild(countElement);
                        }
                        countElement.textContent = data.count;
                        
                        this.showNotification('¡Hay ventas pendientes por procesar!', data.count);
                    }
                }
            })
            .catch(error => {
                console.error('Error al verificar ventas pendientes:', error);
            });
    },

    showNotification(message, count) {
        const notification = document.createElement('div');
        notification.className = 'sales-notification';
        
        const icon = document.createElement('i');
        icon.setAttribute('data-lucide', 'shopping-cart');
        notification.appendChild(icon);
        
        const text = document.createElement('span');
        text.textContent = `${message} (${count} ${count === 1 ? 'venta' : 'ventas'})`;
        notification.appendChild(text);
        
        document.body.appendChild(notification);
        lucide.createIcons();

        this.alertSound.play().catch(e => console.log('Error al reproducir sonido:', e));

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.5s ease-out reverse';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    },

    startSalesCheck() {
        this.checkPendingSales();
        setInterval(() => this.checkPendingSales(), 3600000);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    SalesAlertSystem.init();
});


from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db import transaction
from django.db.models import F, Q
from decimal import Decimal
import logging
from ...models import * 


logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Restaura precios de ofertas y descuentos vencidos'

    def handle(self, *args, **kwargs):
        self.stdout.write("Comando ejecutado correctamente.")
        try:
            with transaction.atomic():
                ofertas_expiradas = HistorialPrecio.objects.select_related('producto').filter(
                    tipo_cambio__in=['OFERTA', 'DESCUENTO'],
                    fecha_fin__lt=timezone.now(),
                    activo=True
                )

                if not ofertas_expiradas.exists():
                    logger.info("No hay ofertas expiradas para restaurar.")
                    return

                for oferta in ofertas_expiradas:
                    try:
                        precio_anterior = HistorialPrecio.objects.filter(
                            producto=oferta.producto,
                            tipo_cambio='AUMENTO',
                            fecha_inicio__lt=oferta.fecha_inicio,
                            activo=True
                        ).order_by('-fecha_inicio').first()

                        precio_restaurar = precio_anterior.precio_nuevo if precio_anterior else oferta.precio_anterior

                        # Crear un nuevo historial de precios
                        HistorialPrecio.objects.create(
                            producto=oferta.producto,
                            precio_anterior=oferta.precio_nuevo,
                            precio_nuevo=precio_restaurar,
                            tipo_cambio='AUMENTO',
                            motivo='Restauración automática de precio',
                            porcentaje=Decimal('0.00'),
                            activo=True
                        )

                        # Desactivar la oferta
                        oferta.activo = False
                        oferta.save()

                        # Actualizar el precio del producto
                        oferta.producto.precio = precio_restaurar
                        oferta.producto.save()

                        logger.info(f'Precio restaurado - Producto: {oferta.producto.nombre} - De: {oferta.precio_nuevo} A: {precio_restaurar}')

                    except Exception as e:
                        logger.error(f'Error restaurando precio del producto {oferta.producto.id}: {str(e)}')
                        continue

                logger.info(f'Proceso completado - {ofertas_expiradas.count()} precios restaurados')

        except Exception as e:
            logger.error(f'Error en proceso de restauración: {str(e)}')
            raise
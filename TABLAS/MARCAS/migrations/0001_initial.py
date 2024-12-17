# Generated by Django 5.1.1 on 2024-11-17 19:26

import TABLAS.MARCAS.validador
import django.core.validators
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomPermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'permissions': (('can_view_registros', 'Can view registros'),),
                'managed': False,
                'default_permissions': (),
            },
        ),
        migrations.CreateModel(
            name='Animal',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('animal', models.CharField(max_length=100, unique=True, validators=[TABLAS.MARCAS.validador.ValidadorTextoCoherente()])),
            ],
        ),
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('categoria', models.CharField(max_length=100, unique=True, validators=[TABLAS.MARCAS.validador.ValidadorTextoCoherente()])),
            ],
        ),
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('consumidor', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Consistencia',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('consistencia', models.CharField(max_length=100, unique=True, validators=[TABLAS.MARCAS.validador.ValidadorTextoCoherente()])),
            ],
        ),
        migrations.CreateModel(
            name='Edad',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('edad', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Marca',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('marca', models.CharField(max_length=100, unique=True, validators=[TABLAS.MARCAS.validador.ValidadorTextoCoherente()])),
            ],
        ),
        migrations.CreateModel(
            name='Sucursal',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('direccion', models.CharField(max_length=100)),
                ('telefono', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Tamaño',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('tamaño', models.CharField(max_length=100, unique=True, validators=[TABLAS.MARCAS.validador.ValidadorTextoCoherente()], verbose_name='Tamaño')),
            ],
        ),
        migrations.CreateModel(
            name='Empleado',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100)),
                ('apellido', models.CharField(max_length=100)),
                ('telefono', models.CharField(max_length=100)),
                ('correo', models.EmailField(max_length=100)),
                ('direccion', models.CharField(max_length=100)),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=100, validators=[TABLAS.MARCAS.validador.ValidadorTextoCoherente()])),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0.01)], verbose_name='Precio')),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='imagenes/', verbose_name='Imagen')),
                ('stock_a', models.IntegerField(verbose_name='Stock Actual')),
                ('stock_m', models.IntegerField(verbose_name='Stock Minimo')),
                ('peso', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=10, null=True, verbose_name='Peso')),
                ('obs', models.CharField(blank=True, default='', max_length=150, null=True, verbose_name='Observaciones')),
                ('des', models.TextField(default='', verbose_name='Descripcion')),
                ('animal', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.animal')),
                ('categoria', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.categoria')),
                ('consis', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.consistencia')),
                ('edad', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.edad')),
                ('marca', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.marca')),
                ('tamaño', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.tamaño')),
            ],
        ),
        migrations.CreateModel(
            name='BolsaAbierta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('precio_restante', models.DecimalField(decimal_places=2, max_digits=10)),
                ('fecha_apertura', models.DateTimeField(auto_now_add=True)),
                ('precio_original', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('en_ultimo_50_porciento', models.BooleanField(default=False)),
                ('esta_abierta', models.BooleanField(default=True)),
                ('fecha_cierre', models.DateTimeField(blank=True, null=True)),
                ('monto_vendido', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MARCAS.producto')),
            ],
        ),
        migrations.CreateModel(
            name='RegistroSesion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('inicio_s', models.DateTimeField(default=django.utils.timezone.now)),
                ('cierre_s', models.DateTimeField(blank=True, null=True)),
                ('empleado', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='MARCAS.empleado')),
            ],
        ),
        migrations.CreateModel(
            name='StockAlert',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')),
                ('leido', models.BooleanField(default=False, verbose_name='Leído')),
                ('nivel_stock', models.IntegerField(verbose_name='Nivel de stock al momento de la alerta')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='alertas', to='MARCAS.producto')),
            ],
            options={
                'verbose_name': 'Alerta de stock',
                'verbose_name_plural': 'Alertas de stock',
                'db_table': 'marcas_stockalert',
                'ordering': ['-fecha_creacion'],
            },
        ),
        migrations.CreateModel(
            name='Caja',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(default='Caja 1', max_length=50)),
                ('abierta', models.BooleanField(default=False, verbose_name='Caja Abierta')),
                ('fecha_hs_ap', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Fecha y hora de apertura')),
                ('fecha_hs_cier', models.DateTimeField(blank=True, default=None, null=True, verbose_name='Fecha y hora de cierre')),
                ('monto_ini', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Monto Inicial')),
                ('total_ing', models.DecimalField(decimal_places=2, default=0, max_digits=10, verbose_name='Total Ingresos')),
                ('total_egr', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Total Egresos')),
                ('empleado', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.empleado')),
                ('sucursal', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.sucursal')),
            ],
        ),
        migrations.CreateModel(
            name='Venta',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('fecha_venta', models.DateField(default=django.utils.timezone.now, verbose_name='Fecha de Venta')),
                ('hora_venta', models.TimeField(default=django.utils.timezone.now, verbose_name='Hora de Venta')),
                ('total_venta', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True, verbose_name='Total')),
                ('estado', models.CharField(choices=[('pendiente', 'Pendiente'), ('pagada', 'Pagada'), ('cancelada', 'Cancelada')], default='pendiente', max_length=10, verbose_name='Estado')),
                ('metodo_pago', models.CharField(choices=[('', '--------'), ('Efectivo', 'Efectivo'), ('Tarjeta debito', 'Tarjeta de Débito'), ('Transferencia', 'Transferencia')], default='', max_length=20, verbose_name='Método de Pago')),
                ('descuento', models.IntegerField(choices=[(0, '0%'), (5, '5%'), (10, '10%'), (15, '15%'), (20, '20%'), (25, '25%'), (30, '30%')], default=0, verbose_name='Descuento Total')),
                ('caja', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.caja')),
                ('cliente', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.cliente')),
            ],
            options={
                'permissions': [('cancelar_venta', 'Puede cancelar una venta')],
            },
        ),
        migrations.CreateModel(
            name='DetalleVenta',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('cantidad', models.IntegerField(verbose_name='Total unidades')),
                ('subtotal', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Subtotal')),
                ('es_suelto', models.BooleanField(default=False)),
                ('precio_unitario', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Precio unitario')),
                ('producto', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.producto')),
                ('venta', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='MARCAS.venta')),
            ],
        ),
        migrations.AddIndex(
            model_name='producto',
            index=models.Index(fields=['nombre', 'marca', 'categoria', 'peso', 'tamaño', 'edad'], name='MARCAS_prod_nombre_cdd967_idx'),
        ),
        migrations.AddIndex(
            model_name='producto',
            index=models.Index(fields=['nombre', 'marca', 'categoria', 'obs', 'tamaño', 'edad'], name='MARCAS_prod_nombre_6d9c9d_idx'),
        ),
    ]

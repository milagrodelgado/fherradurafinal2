# Generated by Django 5.1.1 on 2024-11-22 01:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MARCAS', '0004_movimientostock'),
    ]

    operations = [
        migrations.AddField(
            model_name='empleado',
            name='esta_activo',
            field=models.BooleanField(default=True, verbose_name='Estado Activo'),
        ),
    ]

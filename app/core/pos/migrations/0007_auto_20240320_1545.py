# Generated by Django 3.2.2 on 2024-03-20 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0006_alter_posesioninformal_codigo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='posesioninformal',
            name='coordenada_x',
            field=models.DecimalField(decimal_places=4, max_digits=30),
        ),
        migrations.AlterField(
            model_name='posesioninformal',
            name='coordenada_y',
            field=models.DecimalField(decimal_places=4, max_digits=30),
        ),
    ]

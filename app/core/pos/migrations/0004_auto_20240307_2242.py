# Generated by Django 3.2.2 on 2024-03-08 03:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0003_auto_20240307_2239'),
    ]

    operations = [
        migrations.AlterField(
            model_name='imagenacta',
            name='archivo_firmas',
            field=models.FileField(null=True, upload_to='acta/archivos/'),
        ),
        migrations.AlterField(
            model_name='imagenacta',
            name='boceto',
            field=models.ImageField(null=True, upload_to='acta/imagenes'),
        ),
    ]

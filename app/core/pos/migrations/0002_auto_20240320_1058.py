# Generated by Django 3.2.2 on 2024-03-20 15:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='posesioninformal',
            name='is_matriz',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='imagenacta',
            name='documento_predio_pdf',
            field=models.FileField(null=True, upload_to='acta/archivos/'),
        ),
        migrations.AlterField(
            model_name='imagenacta',
            name='toma_predio_imagen',
            field=models.ImageField(null=True, upload_to='acta/imagenes/'),
        ),
    ]

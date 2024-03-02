# Generated by Django 3.2.2 on 2024-03-02 15:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0008_alter_colindancia_acta'),
    ]

    operations = [
        migrations.AlterField(
            model_name='colindancia',
            name='acta',
            field=models.ForeignKey(default='20240302103742', on_delete=django.db.models.deletion.CASCADE, related_name='colindancias', to='pos.acta'),
        ),
        migrations.AlterField(
            model_name='imagenacta',
            name='boceto',
            field=models.ImageField(upload_to='actas/'),
        ),
        migrations.AlterField(
            model_name='imagenacta',
            name='firma_representante_comision',
            field=models.ImageField(upload_to='actas/'),
        ),
        migrations.AlterField(
            model_name='imagenacta',
            name='firma_supervisor_campo',
            field=models.ImageField(upload_to='actas/'),
        ),
        migrations.AlterField(
            model_name='imagenacta',
            name='firma_topografo',
            field=models.ImageField(upload_to='actas/'),
        ),
    ]

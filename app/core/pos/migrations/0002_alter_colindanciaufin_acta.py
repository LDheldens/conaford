# Generated by Django 3.2.2 on 2024-03-25 20:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='colindanciaufin',
            name='acta',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='colindancia_ufin', to='pos.acta'),
        ),
    ]
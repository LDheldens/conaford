# Generated by Django 3.2.2 on 2024-07-19 16:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0006_paymentsctacollect_paymentnumber'),
    ]

    operations = [
        migrations.AddField(
            model_name='sale',
            name='predio',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, to='pos.acta'),
        ),
    ]

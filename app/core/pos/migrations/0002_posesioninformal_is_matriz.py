# Generated by Django 3.2.2 on 2024-03-19 16:55

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
    ]

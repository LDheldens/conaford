# Generated by Django 3.2.2 on 2024-04-26 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_alter_user_dni'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='dni',
            field=models.CharField(max_length=8, unique=True, verbose_name='DNI'),
        ),
    ]
# Generated by Django 3.2.2 on 2024-03-21 18:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pos', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sale',
            old_name='cash',
            new_name='initial',
        ),
        migrations.RemoveField(
            model_name='product',
            name='image',
        ),
        migrations.RemoveField(
            model_name='product',
            name='price',
        ),
    ]

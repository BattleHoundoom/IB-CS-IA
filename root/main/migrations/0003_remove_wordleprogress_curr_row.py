# Generated by Django 5.0.1 on 2024-01-10 12:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_wordleprogress_curr_row'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='wordleprogress',
            name='curr_row',
        ),
    ]

# Generated by Django 5.0.1 on 2024-01-28 14:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0005_wordlist'),
    ]

    operations = [
        migrations.AddField(
            model_name='wordleprogress',
            name='day',
            field=models.DateField(blank=True, null=True),
        ),
    ]

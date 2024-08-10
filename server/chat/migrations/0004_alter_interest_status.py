# Generated by Django 5.1 on 2024-08-10 15:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_remove_interest_name_interest_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interest',
            name='status',
            field=models.SmallIntegerField(choices=[(1, 'Pending'), (2, 'Accepted'), (3, 'Rejected')], default=1),
        ),
    ]

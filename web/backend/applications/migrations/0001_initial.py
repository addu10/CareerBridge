# Generated by Django 5.0.2 on 2025-03-19 15:50

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Application',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('resume', models.FileField(upload_to='applications/resumes/')),
                ('cover_letter', models.TextField(blank=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('reviewing', 'Reviewing'), ('shortlisted', 'Shortlisted'), ('interview_scheduled', 'Interview Scheduled'), ('rejected', 'Rejected'), ('accepted', 'Accepted'), ('withdrawn', 'Withdrawn')], default='pending', max_length=30)),
                ('applied_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('interview_date', models.DateTimeField(blank=True, null=True)),
                ('notes', models.TextField(blank=True)),
            ],
            options={
                'ordering': ['-applied_at'],
            },
        ),
    ]

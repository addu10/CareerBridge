from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from django.utils.text import slugify
import logging
import os
from django.conf import settings

logger = logging.getLogger(__name__)

class Company(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        try:
            # Handle logo upload
            if self.logo and hasattr(self.logo, 'file'):
                logger.info(f"Attempting to save logo for company: {self.name}")
                logger.info(f"Logo file: {self.logo.name}")
                
                # Let Django's storage system handle the upload
                self.logo.save(self.logo.name, self.logo.file, save=False)
            
            super().save(*args, **kwargs)
            
        except Exception as e:
            logger.error(f"Error saving company {self.name}: {str(e)}")
            raise

    class Meta:
        verbose_name_plural = "Companies"

class JobCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Job Categories"

class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('internship', 'Internship'),
        ('contract', 'Contract'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('closed', 'Closed'),
    ]

    title = models.CharField(max_length=200)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')
    category = models.ForeignKey(JobCategory, on_delete=models.CASCADE, related_name='jobs', null=True, blank=True)
    description = models.TextField()
    requirements = models.TextField()
    location = models.CharField(max_length=200)
    type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deadline = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.title} at {self.company.name}"

    class Meta:
        ordering = ['-created_at']

class Internship(models.Model):
    class Duration(models.TextChoices):
        SUMMER = 'summer', _('Summer')
        WINTER = 'winter', _('Winter')
        SIX_MONTHS = '6_months', _('6 Months')
        ONE_YEAR = '1_year', _('1 Year')

    title = models.CharField(max_length=200)
    company = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posted_internships')
    duration = models.CharField(max_length=20, choices=Duration.choices)
    
    description = models.TextField()
    requirements = models.TextField()
    responsibilities = models.TextField()
    
    location = models.CharField(max_length=200)
    stipend = models.CharField(max_length=100)
    skills_required = models.JSONField(default=list)
    
    start_date = models.DateField()
    end_date = models.DateField()
    application_deadline = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} Internship at {self.company.company_name}"

    class Meta:
        ordering = ['-created_at'] 
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class UserType(models.TextChoices):
        STUDENT = 'student', _('Student')
        COMPANY = 'company', _('Company')
        ADMIN = 'admin', _('Admin')

    user_type = models.CharField(
        max_length=10,
        choices=UserType.choices,
        default=UserType.STUDENT
    )
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    
    # For students
    graduation_year = models.IntegerField(null=True, blank=True)
    branch = models.CharField(max_length=100, blank=True)
    skills = models.JSONField(default=list, blank=True)
    github_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    
    # For companies
    company_name = models.CharField(max_length=200, blank=True)
    company_description = models.TextField(blank=True)
    company_website = models.URLField(blank=True)
    company_logo = models.ImageField(upload_to='company_logos/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user_type == self.UserType.STUDENT:
            return f"{self.get_full_name()} - Student"
        elif self.user_type == self.UserType.COMPANY:
            return f"{self.company_name} - Company"
        return self.username

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users') 
from django.contrib import admin
from .models import Job, Company, JobCategory

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'created_at')
    search_fields = ('name', 'description')
    list_filter = ('created_at',)

@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name', 'description')

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'category', 'location', 'type', 'status', 'created_at')
    list_filter = ('type', 'status', 'category', 'company', 'created_at')
    search_fields = ('title', 'description', 'company__name')
    date_hierarchy = 'created_at' 
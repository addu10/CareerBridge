from django.contrib import admin
from .models import Application

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'status', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'job__company')
    search_fields = ('user__email', 'user__username', 'job__title', 'job__company__name')
    date_hierarchy = 'created_at'
    readonly_fields = ('created_at', 'updated_at') 
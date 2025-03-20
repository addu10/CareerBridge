from django.contrib import admin
from .models import ResumeAnalysis, InterviewPreparation, CareerRoadmap, ATSReview

@admin.register(ResumeAnalysis)
class ResumeAnalysisAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'created_at', 'status')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'job__title')
    date_hierarchy = 'created_at'

@admin.register(InterviewPreparation)
class InterviewPreparationAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'created_at', 'status')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email', 'job__title')
    date_hierarchy = 'created_at'

@admin.register(CareerRoadmap)
class CareerRoadmapAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'status')
    list_filter = ('status', 'created_at')
    search_fields = ('user__email',)
    date_hierarchy = 'created_at'

@admin.register(ATSReview)
class ATSReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'job', 'ats_score', 'created_at')
    list_filter = ('created_at', 'ats_score')
    search_fields = ('user__email', 'job__title', 'job__company__name')
    readonly_fields = ('created_at', 'updated_at')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'job', 'job__company')
    
    def has_add_permission(self, request):
        return False  # ATS reviews should only be created through the API
    
    def has_change_permission(self, request, obj=None):
        return False  # ATS reviews should not be modified through admin
    
    def has_delete_permission(self, request, obj=None):
        return True  # Allow deletion of ATS reviews 
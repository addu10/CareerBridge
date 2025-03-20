from django.contrib import admin
from .models import ResumeAnalysis, ATSReview, InterviewPreparation, CareerRoadmap

@admin.register(ResumeAnalysis)
class ResumeAnalysisAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email',)
    readonly_fields = ('analysis', 'score')

@admin.register(ATSReview)
class ATSReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'score', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email',)
    readonly_fields = ('analysis', 'score')

@admin.register(InterviewPreparation)
class InterviewPreparationAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_title', 'company', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'job_title', 'company')
    readonly_fields = (
        'preparation_content', 'common_questions',
        'technical_questions', 'behavioral_questions', 'tips'
    )

@admin.register(CareerRoadmap)
class CareerRoadmapAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'career_goals')
    readonly_fields = (
        'roadmap_content', 'milestones',
        'skills_to_acquire', 'timeline'
    )
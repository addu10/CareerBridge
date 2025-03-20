from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from jobs.models import Job
from django.contrib.auth import get_user_model

User = get_user_model()

class ResumeAnalysis(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resume_analyses')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='resume_analyses', null=True, blank=True)
    resume = models.FileField(upload_to='resume_analyses/')
    analysis_result = models.JSONField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Resume Analysis for {self.user.email} - {self.job.title if self.job else 'General'}"

class InterviewPreparation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interview_preparations')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='interview_preparations', null=True, blank=True)
    preparation_content = models.JSONField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Interview Preparation for {self.user.email} - {self.job.title if self.job else 'General'}"

class CareerRoadmap(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='career_roadmaps')
    roadmap_content = models.JSONField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Career Roadmap for {self.user.email}"

class ATSReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ats_reviews')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='ats_reviews')
    resume = models.FileField(upload_to='resumes/ats_reviews/')
    ats_score = models.FloatField()
    matched_keywords = models.JSONField()
    missing_keywords = models.JSONField()
    format_analysis = models.JSONField()
    section_completeness = models.JSONField()
    optimization_tips = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'ATS Review'
        verbose_name_plural = 'ATS Reviews'

    def __str__(self):
        return f"ATS Review for {self.user.email} - {self.job.title}" 
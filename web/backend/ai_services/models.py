from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
import uuid
import os

User = get_user_model()

def get_resume_upload_path(instance, filename):
    """Generate a unique path for resume uploads"""
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('uploads', 'resumes', filename)

class BaseAIAnalysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    resume = models.FileField(upload_to=get_resume_upload_path)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    score = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        default=0
    )

    class Meta:
        abstract = True

class ResumeAnalysis(BaseAIAnalysis):
    analysis = models.JSONField()

    class Meta:
        verbose_name = 'Resume Analysis'
        verbose_name_plural = 'Resume Analyses'
        ordering = ['-created_at']

    def __str__(self):
        return f"Resume Analysis for {self.user.email} - {self.created_at.strftime('%Y-%m-%d')}"

class ATSReview(BaseAIAnalysis):
    job_description = models.TextField()
    analysis = models.JSONField()

    class Meta:
        verbose_name = 'ATS Review'
        verbose_name_plural = 'ATS Reviews'
        ordering = ['-created_at']

    def __str__(self):
        return f"ATS Review for {self.user.email} - {self.created_at.strftime('%Y-%m-%d')}"

class InterviewPreparation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    job_title = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    preparation_content = models.JSONField()
    common_questions = models.JSONField()
    technical_questions = models.JSONField()
    behavioral_questions = models.JSONField()
    tips = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Interview Preparation'
        verbose_name_plural = 'Interview Preparations'
        ordering = ['-created_at']

    def __str__(self):
        return f"Interview Prep for {self.user.email} - {self.job_title} at {self.company}"

class CareerRoadmap(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    career_goals = models.TextField()
    preferences = models.JSONField(null=True, blank=True)
    roadmap_content = models.JSONField()
    milestones = models.JSONField()
    skills_to_acquire = models.JSONField()
    timeline = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Career Roadmap'
        verbose_name_plural = 'Career Roadmaps'
        ordering = ['-created_at']

    def __str__(self):
        return f"Career Roadmap for {self.user.email} - {self.created_at.strftime('%Y-%m-%d')}"
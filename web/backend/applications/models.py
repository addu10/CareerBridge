from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from jobs.models import Job, Internship

class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('shortlisted', 'Shortlisted'),
        ('interviewed', 'Interviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications', null=True, blank=True)
    internship = models.ForeignKey(Internship, on_delete=models.CASCADE, null=True, blank=True, related_name='applications')
    
    resume = models.FileField(upload_to='applications/resumes/')
    cover_letter = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    interview_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        position = self.job.title if self.job else self.internship.title if self.internship else 'Unknown Position'
        return f"{self.user.email}'s application for {position}"

    class Meta:
        unique_together = ['user', 'job']
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.job and not self.internship:
            raise ValueError("Either job or internship must be specified")
        if self.job and self.internship:
            raise ValueError("Cannot specify both job and internship")
        super().save(*args, **kwargs) 
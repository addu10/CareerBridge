import os
import django
import requests
from django.core.files.uploadedfile import SimpleUploadedFile

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'internship_portal.settings')
django.setup()

from django.contrib.auth import get_user_model
from jobs.models import Job
from ai_services.models import ResumeAnalysis, InterviewPreparation, CareerRoadmap

User = get_user_model()

def test_ai_services():
    # 1. Create a test user
    test_user, created = User.objects.get_or_create(
        email='test@example.com',
        defaults={
            'password': 'testpass123',
            'is_active': True
        }
    )
    print(f"Created test user: {test_user.email}")

    # 2. Create a test job
    test_job, created = Job.objects.get_or_create(
        title='Software Engineer',
        company='Test Company',
        defaults={
            'description': 'Looking for a skilled software engineer with Python and React experience.',
            'requirements': 'Python, React, AWS, Docker',
            'location': 'Remote',
            'salary_range': '80,000 - 120,000'
        }
    )
    print(f"Created test job: {test_job.title}")

    # 3. Test Resume Analysis
    print("\nTesting Resume Analysis...")
    try:
        # Create a sample resume file
        resume_content = b"Sample resume content"
        resume_file = SimpleUploadedFile(
            "test_resume.txt",
            resume_content,
            content_type="text/plain"
        )

        # Create resume analysis
        resume_analysis = ResumeAnalysis.objects.create(
            user=test_user,
            job=test_job,
            resume=resume_file,
            status='pending'
        )
        print(f"Created resume analysis: {resume_analysis.id}")

        # Get resume analysis
        analysis = ResumeAnalysis.objects.get(id=resume_analysis.id)
        print(f"Retrieved resume analysis: {analysis.id}")
        print(f"Status: {analysis.status}")
        print(f"Created at: {analysis.created_at}")

    except Exception as e:
        print(f"Error in Resume Analysis: {str(e)}")

    # 4. Test Interview Preparation
    print("\nTesting Interview Preparation...")
    try:
        interview_prep = InterviewPreparation.objects.create(
            user=test_user,
            job=test_job,
            status='pending'
        )
        print(f"Created interview preparation: {interview_prep.id}")

        # Get interview preparation
        prep = InterviewPreparation.objects.get(id=interview_prep.id)
        print(f"Retrieved interview preparation: {prep.id}")
        print(f"Status: {prep.status}")
        print(f"Created at: {prep.created_at}")

    except Exception as e:
        print(f"Error in Interview Preparation: {str(e)}")

    # 5. Test Career Roadmap
    print("\nTesting Career Roadmap...")
    try:
        career_roadmap = CareerRoadmap.objects.create(
            user=test_user,
            status='pending'
        )
        print(f"Created career roadmap: {career_roadmap.id}")

        # Get career roadmap
        roadmap = CareerRoadmap.objects.get(id=career_roadmap.id)
        print(f"Retrieved career roadmap: {roadmap.id}")
        print(f"Status: {roadmap.status}")
        print(f"Created at: {roadmap.created_at}")

    except Exception as e:
        print(f"Error in Career Roadmap: {str(e)}")

    # 6. Clean up test data
    print("\nCleaning up test data...")
    ResumeAnalysis.objects.filter(user=test_user).delete()
    InterviewPreparation.objects.filter(user=test_user).delete()
    CareerRoadmap.objects.filter(user=test_user).delete()
    test_job.delete()
    test_user.delete()
    print("Test data cleaned up successfully!")

if __name__ == "__main__":
    test_ai_services() 
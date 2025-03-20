import os
import django
from django.core.files.uploadedfile import SimpleUploadedFile

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODEL', 'internship_portal.settings')
django.setup()

from django.contrib.auth import get_user_model
from jobs.models import Job
from ai_services.models import ResumeAnalysis
from ai_services.utils import analyze_resume

User = get_user_model()

def test_resume_analysis():
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
            'description': '''
            We are looking for a skilled Software Engineer with:
            - 2+ years of experience in Python and React
            - Strong understanding of web development
            - Experience with AWS and Docker
            - Good problem-solving skills
            - Team collaboration experience
            ''',
            'requirements': 'Python, React, AWS, Docker, Git, REST APIs',
            'location': 'Remote',
            'salary_range': '80,000 - 120,000'
        }
    )
    print(f"Created test job: {test_job.title}")

    # 3. Create a sample resume
    sample_resume = '''
    JOHN DOE
    Software Developer
    john.doe@email.com | (123) 456-7890 | LinkedIn: linkedin.com/in/johndoe

    SUMMARY
    Experienced software developer with 2 years of experience in web development.
    Proficient in Python and JavaScript, with a strong foundation in building scalable applications.

    SKILLS
    - Programming Languages: Python, JavaScript, TypeScript
    - Web Development: React.js, Node.js, HTML5, CSS3
    - Databases: PostgreSQL, MongoDB
    - Tools & Technologies: Git, Docker, AWS
    - Other: REST APIs, Agile/Scrum, Unit Testing

    EXPERIENCE
    Software Developer | Tech Solutions Inc. | Jan 2022 - Present
    - Developed and maintained full-stack web applications using Python and React
    - Implemented RESTful APIs and microservices architecture
    - Collaborated with cross-functional teams in an Agile environment
    - Reduced application load time by 40% through optimization

    Junior Developer | Web Apps Co. | Jun 2021 - Dec 2021
    - Built responsive web applications using React and Node.js
    - Worked with SQL databases and REST APIs
    - Participated in code reviews and team meetings

    EDUCATION
    Bachelor of Science in Computer Science
    University of Technology | 2017 - 2021
    GPA: 3.8/4.0

    PROJECTS
    E-commerce Platform
    - Built a full-stack e-commerce application using Python and React
    - Implemented user authentication and payment integration
    - Used Docker for containerization and AWS for deployment
    '''

    # 4. Create a resume file
    resume_file = SimpleUploadedFile(
        "john_doe_resume.txt",
        sample_resume.encode('utf-8'),
        content_type="text/plain"
    )

    # 5. Test Resume Analysis
    print("\nTesting Resume Analysis...")
    try:
        # Create resume analysis
        resume_analysis = ResumeAnalysis.objects.create(
            user=test_user,
            job=test_job,
            resume=resume_file,
            status='pending'
        )
        print(f"Created resume analysis: {resume_analysis.id}")

        # Analyze resume using Gemini AI
        analysis_result = analyze_resume(sample_resume, test_job.description)
        
        # Print analysis results
        print("\nResume Analysis Results:")
        print("=" * 50)
        print("\n1. Overall Analysis:")
        print(analysis_result['analysis'])
        
        print("\n2. Skills Match:")
        print("- Matched Skills:", analysis_result['skills'])
        print("- Experience Level:", analysis_result['experience_level'])
        
        print("\n3. Recommendations:")
        for rec in analysis_result['recommendations']:
            print(f"- {rec}")

        # Update the analysis with results
        resume_analysis.analysis_result = analysis_result
        resume_analysis.status = 'completed'
        resume_analysis.save()

    except Exception as e:
        print(f"Error in Resume Analysis: {str(e)}")

    # 6. Clean up test data
    print("\nCleaning up test data...")
    ResumeAnalysis.objects.filter(user=test_user).delete()
    test_job.delete()
    test_user.delete()
    print("Test data cleaned up successfully!")

if __name__ == "__main__":
    test_resume_analysis() 
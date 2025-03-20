from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import ResumeAnalysis, InterviewPreparation, CareerRoadmap, ATSReview
from .serializers import (
    ResumeAnalysisSerializer, InterviewPreparationSerializer,
    CareerRoadmapSerializer, ATSReviewSerializer
)
from .utils import (
    analyze_resume, prepare_interview, generate_career_roadmap
)
from .ats_review import ATSReviewer
import re

class ResumeAnalysisViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ResumeAnalysis.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Get the resume text from the uploaded file
        resume_file = self.request.FILES.get('resume')
        if not resume_file:
            raise serializers.ValidationError({'resume': 'Resume file is required'})

        # Read the resume text (assuming it's a text file)
        resume_text = resume_file.read().decode('utf-8')
        
        # Get job description if provided
        job_description = self.request.data.get('job_description')
        
        # Analyze resume using Gemini API
        analysis_result = analyze_resume(resume_text, job_description)
        
        # Save the analysis result
        serializer.save(
            user=self.request.user,
            resume=resume_file,
            analysis=analysis_result['analysis'],
            skills=analysis_result['skills'],
            experience_level=analysis_result['experience_level'],
            recommendations=analysis_result['recommendations']
        )

class InterviewPreparationViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewPreparationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return InterviewPreparation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Get the resume text from the user's latest resume analysis
        latest_resume = ResumeAnalysis.objects.filter(
            user=self.request.user
        ).order_by('-created_at').first()
        
        if not latest_resume:
            raise serializers.ValidationError(
                {'resume': 'Please upload and analyze your resume first'}
            )
        
        resume_text = latest_resume.resume.read().decode('utf-8')
        
        # Get job and company details
        job_title = self.request.data.get('job_title')
        company = self.request.data.get('company')
        
        if not job_title or not company:
            raise serializers.ValidationError(
                {'job_title': 'Job title and company are required'}
            )
        
        # Generate interview preparation content using Gemini API
        prep_result = prepare_interview(job_title, company, resume_text)
        
        # Save the preparation content
        serializer.save(
            user=self.request.user,
            job_title=job_title,
            company=company,
            preparation_content=prep_result['preparation_content'],
            common_questions=prep_result['common_questions'],
            technical_questions=prep_result['technical_questions'],
            behavioral_questions=prep_result['behavioral_questions'],
            tips=prep_result['tips']
        )

class CareerRoadmapViewSet(viewsets.ModelViewSet):
    serializer_class = CareerRoadmapSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CareerRoadmap.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Get the user's skills from their latest resume analysis
        latest_resume = ResumeAnalysis.objects.filter(
            user=self.request.user
        ).order_by('-created_at').first()
        
        if not latest_resume:
            raise serializers.ValidationError(
                {'resume': 'Please upload and analyze your resume first'}
            )
        
        skills = latest_resume.skills
        
        # Get career transition details
        current_role = self.request.data.get('current_role')
        target_role = self.request.data.get('target_role')
        experience = self.request.data.get('experience', 0)
        
        if not current_role or not target_role:
            raise serializers.ValidationError(
                {'current_role': 'Current and target roles are required'}
            )
        
        # Generate career roadmap using Gemini API
        roadmap_result = generate_career_roadmap(
            current_role=current_role,
            target_role=target_role,
            skills=skills,
            experience=experience
        )
        
        # Save the roadmap
        serializer.save(
            user=self.request.user,
            current_role=current_role,
            target_role=target_role,
            experience=experience,
            roadmap=roadmap_result['roadmap'],
            required_skills=roadmap_result['required_skills'],
            timeline=roadmap_result['timeline'],
            resources=roadmap_result['resources']
        )

class ATSReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ATSReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ATSReview.objects.filter(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        try:
            resume_file = request.FILES.get('resume')
            job_id = request.data.get('job_id')
            
            if not resume_file or not job_id:
                return Response(
                    {'error': 'Both resume and job_id are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get the job
            job = get_object_or_404(Job, id=job_id)
            
            # Read resume content
            resume_text = resume_file.read().decode('utf-8')
            
            # Initialize ATS reviewer
            ats_reviewer = ATSReviewer()
            
            # Get comprehensive analysis
            analysis = ats_reviewer.analyze_resume(resume_text, job.description)
            
            # Get additional format analysis
            format_analysis = ats_reviewer.check_format_compatibility(resume_text)
            
            # Get section completeness analysis
            section_completeness = ats_reviewer.analyze_section_completeness(resume_text)
            
            # Create ATS review record
            ats_review = ATSReview.objects.create(
                user=request.user,
                job=job,
                resume=resume_file,
                ats_score=analysis['ats_score'],
                matched_keywords=analysis['keyword_analysis']['matched_keywords'],
                missing_keywords=analysis['keyword_analysis']['missing_keywords'],
                format_analysis=format_analysis,
                section_completeness=section_completeness,
                optimization_tips=analysis['optimization_tips']
            )
            
            serializer = self.get_serializer(ats_review)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def check_keywords(self, request):
        """
        Quick check of keyword matching between resume and job description
        """
        try:
            resume_text = request.data.get('resume_text')
            job_id = request.data.get('job_id')
            
            if not resume_text or not job_id:
                return Response(
                    {'error': 'Both resume text and job_id are required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            job = get_object_or_404(Job, id=job_id)
            ats_reviewer = ATSReviewer()
            keywords = ats_reviewer.extract_keywords(job.description)
            
            matched_keywords = []
            missing_keywords = []
            
            for keyword in keywords:
                if re.search(r'\b' + re.escape(keyword) + r'\b', resume_text.lower()):
                    matched_keywords.append(keyword)
                else:
                    missing_keywords.append(keyword)
            
            return Response({
                'matched_keywords': matched_keywords,
                'missing_keywords': missing_keywords,
                'total_keywords': len(keywords),
                'match_percentage': round(len(matched_keywords) / len(keywords) * 100, 2) if keywords else 0
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 
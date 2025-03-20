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
    analyze_resume, prepare_interview, generate_career_roadmap,
    extract_text_from_file
)
from .ats_review import ATSReviewer
import re
import logging

class ResumeAnalysisViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ResumeAnalysis.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def analyze(self, request):
        # Get the resume file from the request
        resume_file = request.FILES.get('resume')
        if not resume_file:
            return Response(
                {'error': 'Resume file is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Extract text from the resume file
            resume_text = extract_text_from_file(resume_file)
            
            # Reset file pointer for saving
            resume_file.seek(0)
            
            # Analyze resume using AI
            analysis_result = analyze_resume(resume_text)
            
            # Format the response
            response_data = {
                'score': analysis_result['score'],
                'strengths': analysis_result['strengths'],
                'weaknesses': analysis_result['weaknesses'],
                'improvements': analysis_result['improvements']
            }

            # Save the analysis
            ResumeAnalysis.objects.create(
                user=request.user,
                resume=resume_file,
                analysis=analysis_result,
                score=analysis_result['score']
            )

            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logging.error(f"Error in resume analysis: {str(e)}")  
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ATSReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ATSReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ATSReview.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def review(self, request):
        # Get the resume file and job description from the request
        resume_file = request.FILES.get('resume')
        job_description = request.POST.get('job_description', '')  
        
        if not resume_file:
            return Response(
                {'error': 'Resume file is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not job_description:
            return Response(
                {'error': 'Job description is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Extract text from the resume file
            resume_text = extract_text_from_file(resume_file)
            
            # Reset file pointer for saving
            resume_file.seek(0)
            
            # Create ATS reviewer instance
            ats_reviewer = ATSReviewer()
            
            # Get ATS review
            review_result = ats_reviewer.analyze_resume(resume_text, job_description)
            
            # Format the response
            response_data = {
                'score': review_result['ats_score'],
                'keyword_analysis': review_result['keyword_analysis'],
                'format_analysis': review_result['format_analysis'],
                'content_analysis': review_result['content_analysis'],
                'optimization_tips': review_result['optimization_tips']
            }

            # Save the review
            ATSReview.objects.create(
                user=request.user,
                resume=resume_file,
                job_description=job_description,
                analysis=review_result,
                score=review_result['ats_score']
            )

            return Response(response_data, status=status.HTTP_200_OK)

        except ValueError as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logging.error(f"Error in ATS review: {str(e)}")  
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
        
        # Generate interview preparation content
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

    @action(detail=False, methods=['post'])
    def generate_roadmap(self, request):
        """
        Generate a career roadmap based on provided skills and goals
        """
        try:
            # Get data from request
            current_skills = request.data.get('current_skills', [])
            target_role = request.data.get('target_role', '')
            experience_level = request.data.get('experience_level', '')
            
            if not current_skills:
                return Response(
                    {'error': 'Current skills are required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            if not target_role:
                return Response(
                    {'error': 'Target role is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create preferences dictionary
            preferences = {
                'experience_level': experience_level
            }
            
            # Generate career roadmap
            roadmap_result = generate_career_roadmap(
                current_skills,
                target_role,
                preferences
            )
            
            # Save the roadmap
            roadmap = CareerRoadmap.objects.create(
                user=request.user,
                career_goals=target_role,
                preferences=preferences,
                roadmap_content=roadmap_result['roadmap_content'],
                milestones=roadmap_result['milestones'],
                skills_to_acquire=roadmap_result['skills_to_acquire'],
                timeline=roadmap_result['timeline']
            )
            
            # Return the result
            return Response(roadmap_result)
            
        except Exception as e:
            print(f"Error generating roadmap: {str(e)}")
            return Response(
                {'error': f'Failed to generate roadmap: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def perform_create(self, serializer):
        # Get the user's skills from their latest resume analysis
        latest_resume = ResumeAnalysis.objects.filter(
            user=self.request.user
        ).order_by('-created_at').first()
        
        if not latest_resume:
            raise serializers.ValidationError(
                {'resume': 'Please upload and analyze your resume first'}
            )
        
        # Get career goals and preferences
        career_goals = self.request.data.get('career_goals')
        preferences = self.request.data.get('preferences')
        
        if not career_goals:
            raise serializers.ValidationError(
                {'career_goals': 'Career goals are required'}
            )
        
        # Generate career roadmap
        roadmap_result = generate_career_roadmap(
            latest_resume.analysis['skills'],
            career_goals,
            preferences
        )
        
        # Save the roadmap
        serializer.save(
            user=self.request.user,
            career_goals=career_goals,
            preferences=preferences,
            roadmap_content=roadmap_result['roadmap_content'],
            milestones=roadmap_result['milestones'],
            skills_to_acquire=roadmap_result['skills_to_acquire'],
            timeline=roadmap_result['timeline']
        )

    @action(detail=False, methods=['post'])
    def download_roadmap(self, request):
        """
        Generate and download a PowerPoint presentation of the roadmap
        """
        try:
            roadmap_data = request.data.get('roadmap_data')
            if not roadmap_data:
                return Response(
                    {'error': 'Roadmap data is required'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create a temporary file for the presentation
            import tempfile
            import os
            from django.http import FileResponse
            
            with tempfile.NamedTemporaryFile(suffix='.pptx', delete=False) as tmp:
                output_path = tmp.name
            
            # Generate the presentation
            presentation_path = generate_roadmap_presentation(roadmap_data, output_path)
            
            # Return the file
            response = FileResponse(
                open(presentation_path, 'rb'),
                content_type='application/vnd.openxmlformats-officedocument.presentationml.presentation'
            )
            response['Content-Disposition'] = 'attachment; filename="career_roadmap.pptx"'
            
            # Delete the temporary file after sending
            os.unlink(presentation_path)
            
            return response
            
        except Exception as e:
            print(f"Error generating roadmap presentation: {str(e)}")
            return Response(
                {'error': f'Failed to generate presentation: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
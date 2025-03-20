from rest_framework import serializers
from .models import ResumeAnalysis, InterviewPreparation, CareerRoadmap, ATSReview
from jobs.serializers import JobSerializer
from users.serializers import UserSerializer

class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = ['id', 'user', 'resume_file', 'analysis_date', 'skills_match', 'improvement_suggestions', 'overall_score', 'keywords_found', 'missing_keywords']
        read_only_fields = ['user', 'analysis_date', 'skills_match', 'improvement_suggestions', 'overall_score', 'keywords_found', 'missing_keywords']

class ATSReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = ATSReview
        fields = [
            'id', 'user', 'job', 'resume', 'ats_score', 'matched_keywords',
            'missing_keywords', 'format_analysis', 'section_completeness',
            'optimization_tips', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user', 'job', 'ats_score', 'matched_keywords', 'missing_keywords', 'format_analysis', 'section_completeness', 'optimization_tips', 'created_at', 'updated_at']

class InterviewPreparationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = InterviewPreparation
        fields = ('id', 'user', 'user_id', 'interview_type', 'job_title',
                 'company', 'common_questions', 'sample_answers', 'tips',
                 'resources', 'created_at', 'last_accessed')
        read_only_fields = ('created_at', 'last_accessed', 'common_questions',
                           'sample_answers', 'tips', 'resources')

class CareerRoadmapSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CareerRoadmap
        fields = ('id', 'user', 'user_id', 'target_role', 'current_skills',
                 'target_skills', 'learning_path', 'recommended_courses',
                 'skill_gaps', 'milestones', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at', 'learning_path',
                           'recommended_courses', 'skill_gaps', 'milestones')
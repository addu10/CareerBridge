from rest_framework import serializers
from .models import Job, Internship
from users.serializers import CompanyProfileSerializer

class JobSerializer(serializers.ModelSerializer):
    company = CompanyProfileSerializer(read_only=True)
    company_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Job
        fields = ('id', 'title', 'company', 'company_id', 'job_type', 'experience_level',
                 'description', 'requirements', 'responsibilities', 'location',
                 'salary_range', 'skills_required', 'application_deadline',
                 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class InternshipSerializer(serializers.ModelSerializer):
    company = CompanyProfileSerializer(read_only=True)
    company_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Internship
        fields = ('id', 'title', 'company', 'company_id', 'duration', 'description',
                 'requirements', 'responsibilities', 'location', 'stipend',
                 'skills_required', 'start_date', 'end_date', 'application_deadline',
                 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('created_at', 'updated_at')

class JobListSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.company_name', read_only=True)
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ('id', 'title', 'company_name', 'job_type', 'experience_level',
                 'location', 'salary_range', 'application_deadline', 'is_active',
                 'application_count')

    def get_application_count(self, obj):
        return obj.applications.count()

class InternshipListSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.company_name', read_only=True)
    application_count = serializers.SerializerMethodField()

    class Meta:
        model = Internship
        fields = ('id', 'title', 'company_name', 'duration', 'location', 'stipend',
                 'start_date', 'end_date', 'application_deadline', 'is_active',
                 'application_count')

    def get_application_count(self, obj):
        return obj.applications.count() 
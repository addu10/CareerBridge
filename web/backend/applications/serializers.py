from rest_framework import serializers
from .models import Application
from users.serializers import UserSerializer
from jobs.serializers import JobSerializer, InternshipSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    applicant = UserSerializer(read_only=True)
    applicant_id = serializers.IntegerField(write_only=True)
    job = JobSerializer(read_only=True)
    job_id = serializers.IntegerField(write_only=True, required=False)
    internship = InternshipSerializer(read_only=True)
    internship_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Application
        fields = ('id', 'applicant', 'applicant_id', 'job', 'job_id',
                 'internship', 'internship_id', 'resume', 'cover_letter',
                 'status', 'applied_at', 'updated_at', 'interview_date', 'notes')
        read_only_fields = ('applied_at', 'updated_at')

    def validate(self, attrs):
        if not attrs.get('job_id') and not attrs.get('internship_id'):
            raise serializers.ValidationError(
                "Either job_id or internship_id must be provided"
            )
        if attrs.get('job_id') and attrs.get('internship_id'):
            raise serializers.ValidationError(
                "Cannot provide both job_id and internship_id"
            )
        return attrs

class ApplicationListSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.get_full_name', read_only=True)
    position_title = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ('id', 'applicant_name', 'position_title', 'company_name',
                 'status', 'applied_at', 'interview_date')

    def get_position_title(self, obj):
        return obj.job.title if obj.job else obj.internship.title

    def get_company_name(self, obj):
        return obj.job.company.company_name if obj.job else obj.internship.company.company_name

class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ('status', 'interview_date', 'notes') 
from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job, Internship
from .serializers import (
    JobSerializer, InternshipSerializer,
    JobListSerializer, InternshipListSerializer
)

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['job_type', 'experience_level', 'is_active']
    search_fields = ['title', 'description', 'requirements']
    ordering_fields = ['created_at', 'application_deadline', 'salary_range']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return JobListSerializer
        return JobSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(company=self.request.user)

class InternshipViewSet(viewsets.ModelViewSet):
    queryset = Internship.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['duration', 'is_active']
    search_fields = ['title', 'description', 'requirements']
    ordering_fields = ['created_at', 'application_deadline', 'stipend']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return InternshipListSerializer
        return InternshipSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(company=self.request.user)

class CompanyJobViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Job.objects.filter(company=self.request.user)

class CompanyInternshipViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InternshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Internship.objects.filter(company=self.request.user) 
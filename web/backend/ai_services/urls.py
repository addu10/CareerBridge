from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ResumeAnalysisViewSet,
    InterviewPreparationViewSet,
    CareerRoadmapViewSet,
    ATSReviewViewSet
)

router = DefaultRouter()
router.register(r'resume-analysis', ResumeAnalysisViewSet, basename='resume-analysis')
router.register(r'interview-prep', InterviewPreparationViewSet, basename='interview-prep')
router.register(r'career-roadmap', CareerRoadmapViewSet, basename='career-roadmap')
router.register(r'ats-review', ATSReviewViewSet, basename='ats-review')

urlpatterns = [
    path('', include(router.urls)),
]
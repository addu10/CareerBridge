from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'jobs', views.JobViewSet)
router.register(r'internships', views.InternshipViewSet)
router.register(r'company/jobs', views.CompanyJobViewSet, basename='company-jobs')
router.register(r'company/internships', views.CompanyInternshipViewSet, basename='company-internships')

urlpatterns = [
    path('', include(router.urls)),
] 
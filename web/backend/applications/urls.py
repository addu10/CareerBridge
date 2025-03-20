from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'applications', views.ApplicationViewSet, basename='application')
router.register(r'company/applications', views.CompanyApplicationViewSet, basename='company-application')

urlpatterns = [
    path('', include(router.urls)),
] 
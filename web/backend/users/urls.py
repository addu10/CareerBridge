from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, StudentProfileViewSet, CompanyProfileViewSet,
    LoginView, LogoutView, PasswordChangeView, PasswordResetView,
    PasswordResetConfirmView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'student-profiles', StudentProfileViewSet, basename='student-profile')
router.register(r'company-profiles', CompanyProfileViewSet, basename='company-profile')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('password/change/', PasswordChangeView.as_view(), name='password-change'),
    path('password/reset/', PasswordResetView.as_view(), name='password-reset'),
    path('password/reset/confirm/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
] 
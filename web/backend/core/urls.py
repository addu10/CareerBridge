from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users.views import CustomTokenObtainPairView, UserViewSet, CompanyLoginView, CompanyRegistrationView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
)

# Direct access to me view
me_view = UserViewSet.as_view({'get': 'me', 'patch': 'me'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # Add me endpoint directly at the root URL configuration
    path('api/users/me/', me_view, name='user-me'),
    # Add company endpoints directly at the root URL configuration for clearer visibility
    path('api/users/company/login/', CompanyLoginView.as_view(), name='company-login'),
    path('api/users/company/register/', CompanyRegistrationView.as_view(), name='company-register'),
    path('api/users/', include('users.urls')),
    path('api/jobs/', include('jobs.urls')),
    path('api/applications/', include('applications.urls')),
    path('api/ai/', include('ai_services.urls')),  # Add AI services URLs
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
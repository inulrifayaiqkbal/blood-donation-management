"""
Main URL configuration for Blood Bank Management System
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),

    # API routes - donor app
    path('api/', include('donor.urls')),

    # API routes - blood request app
    path('api/', include('bloodrequest.urls')),
]

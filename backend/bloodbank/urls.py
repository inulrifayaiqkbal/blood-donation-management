"""
Main URL configuration for Blood Bank Management System
"""

from django.contrib import admin
from django.urls import path, include
from .views import home

urlpatterns = [
    # Backend Home Page
    path('', home, name='home'),

    # Django Admin
    path('admin/', admin.site.urls),

    # API routes - donor app
    path('api/', include('donor.urls')),

    # API routes - blood request app
    path('api/', include('bloodrequest.urls')),
]
from .views import home

path('', home, name='home'),
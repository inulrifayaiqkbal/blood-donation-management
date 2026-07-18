"""
URL patterns for the BloodRequest app.
"""

from django.urls import path
from . import views

urlpatterns = [
    # List all requests / Create a new request
    path('blood-requests/', views.blood_request_list, name='blood-request-list'),

    # Retrieve / Update / Delete a single request
    path('blood-requests/<int:pk>/', views.blood_request_detail, name='blood-request-detail'),
]

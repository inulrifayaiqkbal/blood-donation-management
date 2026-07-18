"""
URL patterns for the Donor app.
"""

from django.urls import path
from . import views

urlpatterns = [
    # List all donors / Create a new donor
    path('donors/', views.donor_list, name='donor-list'),

    # Retrieve / Update / Delete a single donor
    path('donors/<int:pk>/', views.donor_detail, name='donor-detail'),
]

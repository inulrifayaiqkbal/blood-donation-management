"""
Django Admin configuration for the BloodRequest app.
"""

from django.contrib import admin
from .models import BloodRequest


@admin.register(BloodRequest)
class BloodRequestAdmin(admin.ModelAdmin):
    """Admin panel configuration for BloodRequest model."""

    list_display = ['id', 'patient_name', 'blood_group', 'hospital', 'city', 'status', 'created_at']
    list_filter = ['blood_group', 'status', 'city']
    search_fields = ['patient_name', 'hospital', 'city']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    list_editable = ['status']

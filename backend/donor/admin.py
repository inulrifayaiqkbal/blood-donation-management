"""
Django Admin configuration for the Donor app.
"""

from django.contrib import admin
from .models import Donor


@admin.register(Donor)
class DonorAdmin(admin.ModelAdmin):
    """Admin panel configuration for Donor model."""

    list_display = ['id', 'name', 'blood_group', 'gender', 'age', 'phone', 'city', 'created_at']
    list_filter = ['blood_group', 'gender', 'city']
    search_fields = ['name', 'email', 'phone', 'city']
    ordering = ['-created_at']
    readonly_fields = ['created_at']

"""
Serializers for the BloodRequest app.
Converts BloodRequest model instances to/from JSON.
"""

from rest_framework import serializers
from .models import BloodRequest


class BloodRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for the BloodRequest model.
    Handles validation and serialization of blood request data.
    """

    class Meta:
        model = BloodRequest
        fields = [
            'id',
            'patient_name',
            'blood_group',
            'hospital',
            'phone',
            'city',
            'message',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'status', 'created_at']

    def validate_phone(self, value):
        """Basic phone number validation."""
        digits = ''.join(filter(str.isdigit, value))
        if len(digits) < 7:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value

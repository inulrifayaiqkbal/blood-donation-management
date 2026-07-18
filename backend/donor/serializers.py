"""
Serializers for the Donor app.
Converts Donor model instances to/from JSON.
"""

from rest_framework import serializers
from .models import Donor


class DonorSerializer(serializers.ModelSerializer):
    """
    Serializer for the Donor model.
    Handles validation and serialization of donor data.
    """

    class Meta:
        model = Donor
        fields = [
            'id',
            'name',
            'age',
            'gender',
            'blood_group',
            'phone',
            'email',
            'address',
            'city',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def validate_age(self, value):
        """Donors must be between 18 and 65 years old."""
        if value < 18:
            raise serializers.ValidationError("Donor must be at least 18 years old.")
        if value > 65:
            raise serializers.ValidationError("Donor must be 65 years old or younger.")
        return value

    def validate_phone(self, value):
        """Basic phone number validation."""
        # Strip spaces/dashes for length check
        digits = ''.join(filter(str.isdigit, value))
        if len(digits) < 7:
            raise serializers.ValidationError("Please enter a valid phone number.")
        return value

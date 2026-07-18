"""
Views for the Donor app.
Provides CRUD operations via Django REST Framework.
"""

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import Donor
from .serializers import DonorSerializer


@api_view(['GET', 'POST'])
def donor_list(request):
    """
    GET  /api/donors/          - List all donors (supports ?blood_group= and ?city= filters)
    POST /api/donors/          - Create a new donor
    """
    if request.method == 'GET':
        donors = Donor.objects.all()

        # Filter by blood group (case-insensitive)
        blood_group = request.query_params.get('blood_group', None)
        if blood_group:
            donors = donors.filter(blood_group__iexact=blood_group)

        # Filter by city (partial, case-insensitive)
        city = request.query_params.get('city', None)
        if city:
            donors = donors.filter(city__icontains=city)

        # General search across name, blood group, city
        search = request.query_params.get('search', None)
        if search:
            donors = donors.filter(
                Q(name__icontains=search) |
                Q(blood_group__icontains=search) |
                Q(city__icontains=search) |
                Q(email__icontains=search)
            )

        serializer = DonorSerializer(donors, many=True)
        return Response({
            'success': True,
            'count': donors.count(),
            'donors': serializer.data
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = DonorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Donor registered successfully!',
                'donor': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Registration failed. Please check the form.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def donor_detail(request, pk):
    """
    GET    /api/donors/<id>/   - Retrieve a single donor
    PUT    /api/donors/<id>/   - Full update of a donor
    PATCH  /api/donors/<id>/   - Partial update of a donor
    DELETE /api/donors/<id>/   - Delete a donor
    """
    try:
        donor = Donor.objects.get(pk=pk)
    except Donor.DoesNotExist:
        return Response({
            'success': False,
            'message': f'Donor with id {pk} not found.'
        }, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DonorSerializer(donor)
        return Response({
            'success': True,
            'donor': serializer.data
        }, status=status.HTTP_200_OK)

    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = DonorSerializer(donor, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Donor updated successfully!',
                'donor': serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            'success': False,
            'message': 'Update failed. Please check the form.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        donor_name = donor.name
        donor.delete()
        return Response({
            'success': True,
            'message': f'Donor "{donor_name}" deleted successfully.'
        }, status=status.HTTP_200_OK)

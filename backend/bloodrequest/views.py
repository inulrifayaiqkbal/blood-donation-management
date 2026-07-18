"""
Views for the BloodRequest app.
Provides CRUD operations via Django REST Framework.
"""

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import BloodRequest
from .serializers import BloodRequestSerializer


@api_view(['GET', 'POST'])
def blood_request_list(request):
    """
    GET  /api/blood-requests/    - List all blood requests (supports ?blood_group= and ?city= filters)
    POST /api/blood-requests/    - Submit a new blood request
    """
    if request.method == 'GET':
        requests = BloodRequest.objects.all()

        # Filter by blood group
        blood_group = request.query_params.get('blood_group', None)
        if blood_group:
            requests = requests.filter(blood_group__iexact=blood_group)

        # Filter by city
        city = request.query_params.get('city', None)
        if city:
            requests = requests.filter(city__icontains=city)

        # Filter by status
        req_status = request.query_params.get('status', None)
        if req_status:
            requests = requests.filter(status__iexact=req_status)

        # General search
        search = request.query_params.get('search', None)
        if search:
            requests = requests.filter(
                Q(patient_name__icontains=search) |
                Q(hospital__icontains=search) |
                Q(blood_group__icontains=search) |
                Q(city__icontains=search)
            )

        serializer = BloodRequestSerializer(requests, many=True)
        return Response({
            'success': True,
            'count': requests.count(),
            'requests': serializer.data
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = BloodRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Blood request submitted successfully!',
                'request': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'success': False,
            'message': 'Submission failed. Please check the form.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
def blood_request_detail(request, pk):
    """
    GET    /api/blood-requests/<id>/   - Retrieve a single blood request
    PUT    /api/blood-requests/<id>/   - Full update
    PATCH  /api/blood-requests/<id>/   - Partial update (e.g., change status)
    DELETE /api/blood-requests/<id>/   - Delete a blood request
    """
    try:
        blood_request = BloodRequest.objects.get(pk=pk)
    except BloodRequest.DoesNotExist:
        return Response({
            'success': False,
            'message': f'Blood request with id {pk} not found.'
        }, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BloodRequestSerializer(blood_request)
        return Response({
            'success': True,
            'request': serializer.data
        }, status=status.HTTP_200_OK)

    elif request.method in ['PUT', 'PATCH']:
        partial = request.method == 'PATCH'
        serializer = BloodRequestSerializer(blood_request, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Blood request updated successfully!',
                'request': serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            'success': False,
            'message': 'Update failed.',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        patient_name = blood_request.patient_name
        blood_request.delete()
        return Response({
            'success': True,
            'message': f'Blood request for "{patient_name}" deleted successfully.'
        }, status=status.HTTP_200_OK)

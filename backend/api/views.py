from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, DriverProfile, Car, Booking
from .serializers import UserSerializer, DriverProfileSerializer, CarSerializer, BookingSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def login(self, request):
        role = request.data.get('role', 'user')
        username = f"{role}_demo" # Simple demo authentication
        user, created = User.objects.get_or_create(username=username, defaults={'role': role})
        if created and role == 'driver':
            DriverProfile.objects.create(user=user)
        return Response(UserSerializer(user).data)

class DriverProfileViewSet(viewsets.ModelViewSet):
    queryset = DriverProfile.objects.all()
    serializer_class = DriverProfileSerializer

class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer

    @action(detail=True, methods=['post'])
    def toggle_status(self, request, pk=None):
        car = self.get_object()
        new_status = request.data.get('status')
        if new_status:
            car.status = new_status
            car.save()
            return Response({'status': 'updated', 'car_status': car.status})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        booking = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Booking.STATUS_CHOICES):
            booking.status = new_status
            booking.save()
            return Response({'status': 'updated', 'booking_status': booking.status})
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

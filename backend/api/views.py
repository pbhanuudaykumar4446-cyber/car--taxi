from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, DriverProfile, Car, Booking
from .serializers import UserSerializer, DriverProfileSerializer, CarSerializer, BookingSerializer
from django.contrib.auth.hashers import make_password, check_password

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                return Response(UserSerializer(user).data)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'])
    def register(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        phone = request.data.get('phone', '')
        role = request.data.get('role', 'user')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = User.objects.create(
            username=username,
            password=make_password(password),
            email=email,
            phone=phone,
            role=role
        )
        if role == 'driver':
            DriverProfile.objects.create(user=user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

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

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DriverProfileViewSet, CarViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'drivers', DriverProfileViewSet)
router.register(r'cars', CarViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

from django.urls import path
from .views import test_api
from . import views

urlpatterns = [
    path('test/', test_api),
    path('create_user/', views.create_user)
]

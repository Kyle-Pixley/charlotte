from django.urls import path
from .views import test_api
from . import views


urlpatterns = [
    path('test/', test_api),
    path('create_user/', views.create_user),
    path('login_user/', views.login_user),
    path('find_user_id/', views.find_user_id),
    path('find_username/', views.find_username),
    
]

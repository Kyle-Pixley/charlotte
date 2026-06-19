from django.urls import path
from .views import test_api
from . import views


urlpatterns = [
    path('test/', test_api),
    path('create_user/', views.create_user),
    path('login_user/', views.login_user),
    path('find_user_id/', views.find_user_id),
    path('find_username/', views.find_username),
    path('create_chatroom/', views.create_chatroom),
    path('request_to_join_chatroom/', views.request_to_join_chatroom),
    path('approve_join_request/', views.approve_join_request),
    
]

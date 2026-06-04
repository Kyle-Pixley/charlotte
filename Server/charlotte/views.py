from django.shortcuts import render

# Create your views here.
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response 
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
import jwt
import datetime
from .models import User

@api_view(["GET"])
def test_api(request):
    return Response({"message":"Charlotte backend is working"})

## USER
# Create New User
@csrf_exempt
def create_user(request):
    print('Create user route hit')
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data['username']
            email = data['email']
            raw_password = data['password']

            hashed_password = make_password(raw_password)

            user = User.objects.create(username=username, email=email, password=hashed_password)
            
            payload = {
                'user_id' : user.id,
                'username' : user.username,
                'exp' : datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(seconds=settings.JWT_EXP_DELTA_SECONDS)
            }
            token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

            return JsonResponse({'message' : 'User Created Successfully', 'user_id' : user.id, 'token' : token}, status=201)

        except KeyError:
            return JsonResponse({'error' : 'Missing required fields'}, status=400)
        except Exception as e:
            return JsonResponse({'error' : str(e)}, status=500)

    else: 
        return JsonResponse({'error' : 'Only POST method allowed'}, status=405)

#Log in user
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            input_username = data.get('username')
            input_password = data.get('password')

            if (not input_username) or (not input_password):
                return JsonResponse({ 'error' : 'Please provide User Name and Password'}, status=400)

            try:
                found_user = User.objects.get(username = input_username)
            except User.DoesNotExist:
                return JsonResponse({'error' : 'Incorrect User Name'}, status=404)

            if not check_password(input_password, found_user.password):
                return JsonResponse({'error' : 'Password incorrect'}, status=401)
            
            payload = {
                'user_id' : found_user.id,
                'username' : found_user.username,
                'exp' : datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(seconds=settings.JWT_EXP_DELTA_SECONDS)
            }
            token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

            return JsonResponse({'message' : 'User Logged in Successfully', 'token' : token}, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({'error' : 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error' : str(e)}, status=500)

    else: 
        return JsonResponse({'error' : 'Only POST method allowed'}, status=405)
    
#Finds User by ID
@csrf_exempt
def find_user_id(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            input_id = data.get('id')

            if not input_id:
                return JsonResponse({'error' : 'Please Provide and ID'}, status=400)
            
            try:
                found_user = User.objects.get(id=input_id)
            except User.DoesNotExist:
                return JsonResponse({'error' : 'User Not Found'}, status=404)

            return JsonResponse({
                'message' : 'User found',
                'data' : {
                    'id' : found_user.id,
                    'username' : found_user.username,
                    'email' : found_user.email
                }
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error' : 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error' : str(e)}, status=500)

    else:
        return JsonResponse({'error' : 'Only POST method allowed'}, status=405)

# Find user by username
@csrf_exempt
def find_username(request):
    if request.method == "POST":
        try: 
            data = json.loads(request.body)
            input_username = data.get('username')

            if not input_username:
                return JsonResponse({'error' : 'Please Provide Username'}, status=400)

            matched_users = User.objects.filter(username__icontains=input_username).order_by('username')[:5]

            if not matched_users.exists():
                return JsonResponse({'error' : 'No users found'}, status=404)

            user_data = [{'id' : user.id, 'username' : user.username} for user in matched_users]

            return JsonResponse({'message' : 'Users found', 'data' : user_data}, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({'error' : 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error' : str(e)}, status=500)

    else:
        return JsonResponse({'error' : 'Only POST method allowed'}, status=405)
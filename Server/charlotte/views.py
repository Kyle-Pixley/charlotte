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


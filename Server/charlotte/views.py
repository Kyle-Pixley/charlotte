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
from .models import User, ChatRoom, ChatRoomJoinRequest, Message

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

#Create New Chat Room 
@csrf_exempt
def create_chatroom(request):
    if request.method != "POST":
        return JsonResponse({"error" : "Post request Only"}, status=405)

    try:
        data = json.loads(request.body)
        name = data.get("name")
        admin_id = data.get("admin_id")
        

        if not admin_id:
            return JsonResponse({"error" : "admin_id is required"}, status=400)

        try:
            admin = User.objects.get(id=admin_id)
        except User.DoesNotExist:
            return JsonResponse({"error" : 'Admin user does not exist'}, status=404)

        chatroom = ChatRoom.objects.create(
            name=name,
            admin=admin
        )

        chatroom.participants.add(admin)

        return JsonResponse({
            "message" : 'Chatroom created',
            "chatroom" : {
                "id" : chatroom.id,
                "name" : chatroom.name,
                "admin_id" : chatroom.admin.id,
                "participants" : list(chatroom.participants.values_list("id", flat=True)),
                "created_at" : chatroom.created_at,
            }
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({"error" : "Invalid JSON"}, status=400)

#Create Request To Join Room 
@csrf_exempt
def request_to_join_chatroom(request):
    if request.method != "POST":
        return JsonResponse({"Error" : "POST method only"}, status=405)

    try: 
        data = json.loads(request.body)

        user_id = data.get("user_id")
        chatroom_id = data.get("chatroom_id")

        if not user_id or not chatroom_id:
            return JsonResponse({"error" : "missing user_id and or chatroom_id"}, status=400)
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({"error":"user does not exist"}, status=404)

        try:
            chatroom = ChatRoom.objects.get(id=chatroom_id)
        except ChatRoom.DoesNotExist:
            return JsonResponse({"error" : "Chatrrom does not exist"}, status=404)
        
        if chatroom.participants.filter(id=user.id).exists():
            return JsonResponse({'error' : "user already participant"}, status=400)
        
        join_request, created = ChatRoomJoinRequest.objects.get_or_create(
            chatroom=chatroom,
            user=user
        )

        if not created:
            return JsonResponse({"error" : 'join request already exists'}, status=400)

        return JsonResponse({
            "message" : "Join request sent",
            "request" : {
                "id" : join_request.id,
                "chatroom_id" : chatroom.id,
                "user_id" : user.id,
                "username" : user.username,
                "created_at" : join_request.created_at,
            }
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error" : "invalid JSON"}, status=400)

#admin approves a join request
@csrf_exempt
def approve_join_request(request):
    if request.method != "POST":
        return JsonResponse({"error":"POST method only"}, status=405)

    try:
        data = json.loads(request.body)

        admin_id = data. get("admin_id")
        request_id = data.get("request_id")


        if not admin_id or not request_id:
            return JsonResponse({"error" : "admin_id and request_id ar required"}, status=400)

        try: 
            join_request = ChatRoomJoinRequest.objects.get(id=request_id)
        except ChatRoomJoinRequest.DoesNotExist:
            return JsonResponse({"error" : "Join request does not exist"}, status=404)

        chatroom = join_request.chatroom

        user_joining = ChatRoomJoinRequest.objects.get(id=request_id)

        user_joining = join_request.user.username

        if chatroom.admin.id != admin_id:
            return JsonResponse({"error" : "Only the room admin can approve requests"}, status=403)
        
        chatroom.participants.add(join_request.user)

        system_message = Message.objects.create(
            sender=chatroom.admin,
            receiver=None,
            chatroom=chatroom,
            body =f"{user_joining} has joined the group",
            is_system_message=True
        )

        join_request.delete()

        return JsonResponse({
            "message" : "Join request granted",
            "chatroom_id" : chatroom.id,
            "added_user_id" : join_request.user.id,
            "system_message" : {
                "id" : system_message.id,
                "body" : system_message.is_system_message,
                "timestamp" : system_message.timestamp,
            }
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error" : "invalid JSON"}, status=400)


#Create Message For ChatRoom
@csrf_exempt
def create_room_message(request):
    if request.method != "POST":
        return JsonResponse({"Error request must be POST"})
    
    try:
        data = json.loads(request.body)

        sender_id = data.get("sender_id")
        chatroom_id = data.get("chatroom_id")
        body = data.get("body")

        if not sender_id or not chatroom_id or not body:
            return JsonResponse({"error" : "sender_id, chatroom_id, and body required"}, status=400)

        try : 
            sender = User.objects.get(id=sender_id)
        except User.DoesNotExist:
            return JsonResponse({"error" : "Sender does not exist"}, status=404)

        try:
            chatroom = ChatRoom.objects.get(id=chatroom_id)
        except ChatRoom.DoesNotExist:
            return JsonResponse({"error" : "chatroom does not exist"}, status=404)

        if not chatroom.participants.filter(id=sender.id).exists():
            return JsonResponse({"error" : "user not included in room"},status=403)

        message = Message.objects.create(
            sender=sender,
            receiver=None,
            chatroom=chatroom,
            body=body,
            is_system_message=False
        )
        return JsonResponse({
            "message" : "Room message created",
            "room_message": {
                "id" : message.id,
                "sender_id" : message.sender_id,
                "sender_username" : message.sender.username,
                "chatroom_id" : message.chatroom_id,
                "body" : message.body,
                "is_system_message" : message.is_system_message,
                "timestamp" : message.timestamp
            }
         }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error":"Invalid JSON"}, status=400)
import hashlib
import uuid

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import authentication
import json
from .models import User, DoesNotExist
from datetime import datetime


def hash_password(password):
    salt = uuid.uuid4().hex
    return hashlib.sha256(salt.encode() + password.encode()).hexdigest() + ':' + salt


def check_password(hashed_password, user_password):
    password, salt = hashed_password.split(':')
    return password == hashlib.sha256(salt.encode() + user_password.encode()).hexdigest()


def user_json(user):
    obj = {}
    obj['full_name'] = user.full_name
    obj['username'] = user.username
    obj['email'] = user.email
    obj['password'] = hash_password(user.password)
    obj['type'] = user.type
    obj['gender'] = user.gender
    obj['bio'] = user.bio
    obj['profile_image'] = user.profile_image
    obj['created_at'] = user.created_at
    obj['updated_at'] = user.updated_at
    return obj


def modify_user(json, user):
    user.full_name = json['full_name'] if json['full_name'] else user.full_name
    user.username = json['username'] if json['username'] else user.username
    user.email = json['email'] if json['email'] else user.email
    user.password = hash_password(json['password']) if json['password'] else user.password
    user.type = json['type'] if json['type'] else user.type
    user.gender = json['gender'] if json['gender'] else user.gender
    user.bio = json['bio'] if json['bio'] else user.bio
    user.profile_image = json['profile_image'] if json['profile_image'] else user.bio
    user.updated_at = datetime.now()
    return user


@csrf_exempt
def login(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        try:
            user = User.objects.get(username=body['username'])
            if not check_password(user.password, str(body['password'])):
                raise DoesNotExist
        except DoesNotExist:
            return JsonResponse({'response': False, 'error': 'Credentials are not correct!'})
        except Exception as e:
            return JsonResponse({'response': False, 'error': str(e)})
        return JsonResponse({'response': True, 'api_token': authentication.generate_token(user)})

    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


@csrf_exempt
def register(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        new_user = User()
        try:
            new_user.username = body['username']
            new_user.password = hash_password(body['password'])
            new_user.full_name = body['full_name']
            new_user.email = body['email']
        except Exception as e:
            return JsonResponse({'response': False, 'error': str(e)})
        new_user.save()
        return JsonResponse({"response": True})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


@csrf_exempt
def logout(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if token and authentication.is_authenticated(token):
        authentication.logout(token)
        return JsonResponse({'response': True})
    return JsonResponse({'response': False})


@csrf_exempt
def get_user(request, user_id):
    if request.method == 'GET':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            user = User.objects.get(id=user_id)
            try:
                return JsonResponse({"response": True, "user": user_json(user)})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


@csrf_exempt
def get_current_user(request):
    if request.method == 'GET':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        user_id = authentication.get_user_id(token)
        if token and authentication.is_authenticated(token):
            user = User.objects.get(id=user_id)
            try:
                return JsonResponse({"response": True, "user": user_json(user)})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


@csrf_exempt
def update_user(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        body = json.loads(request.body.decode('utf-8'))
        user_id = authentication.get_user_id(token)
        user = User.objects.get(id=user_id)
        modify_user(body, user)
        if token and authentication.is_authenticated(token):
            try:
                user.save()
                return JsonResponse({"response": True})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": request.method
    })


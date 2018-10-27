import hashlib
import uuid

from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import authentication
import json
from user.models import User, DoesNotExist


def hash_password(password):
    # uuid is used to generate a random number
    salt = uuid.uuid4().hex
    return hashlib.sha256(salt.encode() + password.encode()).hexdigest() + ':' + salt


def check_password(hashed_password, user_password):
    password, salt = hashed_password.split(':')
    return password == hashlib.sha256(salt.encode() + user_password.encode()).hexdigest()


@csrf_exempt
def login(request):
    if request.method == 'POST':
        # return JsonResponse({"ans": request.META.get('HTTP_AUTHORIZATION')})
        body = json.loads(request.body.decode('utf-8'))
        try:
            user = User.objects.get(username=body['username'])
            if not check_password(user.password, str(body['password'])):
                raise DoesNotExist
        except DoesNotExist:
            return JsonResponse({'response': False, 'error': 'Credentials are not correct!'})
        except Exception as e:
            return JsonResponse({'response': False, 'error': str(e)})
        return JsonResponse({'response': True, 'api_token': authentication.generate_token(user).decode('utf-8')})

    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })

@csrf_exempt
def register(request):
    if request.method == 'POST':
        body = json.loads(request.body.decode('utf-8'))
        new_user = User()
        new_user.username = body['username']
        new_user.password = hash_password(body['password'])
        new_user.full_name = body['full_name']
        new_user.email = body['email']
        new_user.save()
        return JsonResponse({"response": True})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })

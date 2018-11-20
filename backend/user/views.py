import hashlib
import uuid

from django.http import JsonResponse,HttpResponse,Http404
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from . import authentication
import json
from datetime import datetime
import os
import re
from django.core import validators
from api.utils import *
from .models import User, DoesNotExist, Rating
from project import models


def hash_password(password):
    if not re.match(r'[A-Za-z0-9]{8,}', password):  # Upper and lower case letters and numbers, 8 characters
        raise validators.ValidationError('Password does not meet requirements')
    salt = uuid.uuid4().hex
    return hashlib.sha256(salt.encode() + password.encode()).hexdigest() + ':' + salt


def check_password(hashed_password, user_password):
    password, salt = hashed_password.split(':')
    return password == hashlib.sha256(salt.encode() + user_password.encode()).hexdigest()


def modify_user(json, user):
    user.full_name = json['full_name'] if 'full_name' in json else user.full_name
    user.username = json['username'] if 'username' in json else user.username
    user.email = json['email'] if 'email' in json else user.email
    user.password = hash_password(json['password']) if 'password' in json else user.password
    user.type = json['type'] if 'type' in json else user.type
    user.gender = json['gender'] if 'gender' in json else user.gender
    user.bio = json['bio'] if 'bio' in json else user.bio
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
            new_user.save()
        except Exception as e:
            return JsonResponse({'response': False, 'error': str(e)})
        return JsonResponse({"response": True, 'api_token': authentication.generate_token(new_user)})
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
                return JsonResponse({"response": True, "user": user_json(user, user_id=authentication.get_user_id(token))})
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
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            user = User.objects.get(id=user_id)
            try:
                return JsonResponse({"response": True, "user": user_json(user, user_id)})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def handle_uploaded_file(app_name, file, filename):
    if not os.path.exists('media/'):
        os.mkdir('media/')
    if not os.path.exists('media/'+app_name):
        os.mkdir('media/'+app_name)

    with open('media/' + app_name + '/' + filename, 'wb+') as destination:
        for chunk in file.chunks():
            destination.write(chunk)


@csrf_exempt
def upload_image(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            user = User.objects.get(id=user_id)
            try:
                if not allowed_file(str(request.FILES['profile_image'])):
                    raise Exception("unsupported file type")
                filename = str(user_id) + str(int(datetime.now().timestamp())) + '.' + \
                           str(request.FILES['profile_image']).rsplit('.', 1)[1]
                handle_uploaded_file('profile_images', request.FILES['profile_image'],
                                     filename)
                user.profile_image = filename
                user.updated_at = datetime.now()
                user.save()
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
            return JsonResponse({'response': True})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": request.method
    })


@csrf_exempt
def update_user(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            user_id = authentication.get_user_id(token)
            user = User.objects.get(id=user_id)
            modify_user(body, user)
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


# Inputs: project_id, value, comment
@csrf_exempt
def add_rating(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            user_id = authentication.get_user_id(token)

            project = models.Project.objects.get(id=body['project_id'])
            new_rating = Rating()

            if user_id == str(project.owner_id.id):
                new_rating.rater = project.owner_id
                new_rating.rated = project.freelancer_id
            elif user_id == str(project.freelancer_id.id):
                new_rating.rater = project.freelancer_id
                new_rating.rated = project.owner_id
            else:
                return JsonResponse({'response': False, 'error': "Not allowed to add rating for this project"})

            try:
                new_rating.project = project
                new_rating.value = body['value']
                new_rating.comment = body['comment']
                new_rating.save()
                return JsonResponse({'response': True})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


# Inputs: project_id, value, comment
@csrf_exempt
def get_rating(request, rating_id):
    if request.method == 'GET':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            # body = json.loads(request.body.decode('utf-8'))
            user_id = authentication.get_user_id(token)
            try:
                rating = Rating.objects.get(id=rating_id)
                return JsonResponse({'response': True, 'rating': rating_json(rating, user_id, "rating")})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })

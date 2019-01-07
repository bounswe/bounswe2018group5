import hashlib
import uuid

from django.http import JsonResponse, HttpResponse, Http404
from django.utils.dateparse import parse_datetime
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from . import authentication
import json
from datetime import datetime
import os
import re
from django.core import validators
from api.utils import *
from .models import *
from project.models import *
from api.semantic_tags import create_tag


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


def modify_portfolio(json, portfolio):
    portfolio.title = json['title'] if 'title' in json else portfolio.title
    portfolio.description = json['description'] if 'description' in json else portfolio.description
    portfolio.date = parse_datetime(json['date']) if 'date' in json else portfolio.date
    portfolio.project_id = json['project_id'] if 'project_id' in json else portfolio.project_id
    portfolio.updated_at = datetime.now()
    return portfolio


def create_wallet(user):
    wallet = Wallet()
    wallet.user = User.objects.get(id=user.id)
    wallet.balance = 0
    wallet.save()


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
            create_wallet(new_user)
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


# GET: if user_id is provided, returns the specified user, otherwise returns the user that makes the request
# PUT: updates the user
@csrf_exempt
def profile_handler(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if request.method == 'GET':
        user_id = request.GET.get('user_id', '')
        if token and authentication.is_authenticated(token):
            caller_id = authentication.get_user_id(token)
            if user_id == '':
                user_id = caller_id
            user = User.objects.get(id=user_id)
            try:
                return JsonResponse({"response": True, "user": user_json(user, caller_id)})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    elif request.method == 'PUT':
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
        "error": "wrong request method"
    })


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg'}


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


# returns rating with given id if GET request, adds new rating if POST request
@csrf_exempt
def rating_handler(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if request.method == 'GET':
        rating_id = request.GET.get('id', '')
        if rating_id == '':
            return JsonResponse({"response": False, "error": "rating_id not provided"})
        if token and authentication.is_authenticated(token):
            try:
                rating = Rating.objects.get(id=rating_id)
                return JsonResponse({'response': True, 'rating': rating_json(rating, "rating")})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    elif request.method == 'POST':
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            user_id = authentication.get_user_id(token)
            project = Project.objects.get(id=body['project_id'])
            new_rating = Rating()
            if user_id == str(project.owner.id):
                if get_rating(rater=project.owner, rated=project.freelancer, project=project):
                    return JsonResponse({'response': False, 'error': "There is already a rating for this specifics"})
                new_rating.rater = project.owner
                new_rating.rated = project.freelancer
            elif user_id == str(project.freelancer.id):
                if get_rating(rater=project.freelancer, rated=project.owner, project=project):
                    return JsonResponse({'response': False, 'error': "There is already a rating for this specifics"})
                new_rating.rater = project.freelancer
                new_rating.rated = project.owner
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
    else:
        return JsonResponse({
            "response": False,
            "error": "wrong request method"
        })


def get_rating(rater, rated, project):
    ratings = Rating.objects.filter(rater=rater, rated=rated, project=project)
    if len(ratings) > 0:
        return ratings[0]
    else:
        return None


@csrf_exempt
def portfolio_handler(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            user_id = authentication.get_user_id(token)
            new_portfolio = Portfolio()
            new_portfolio.title = body['title']
            new_portfolio.description = body['description']
            new_portfolio.date = parse_datetime(body['date']) if "date" in body else None
            if "project_id" in body:
                new_portfolio.project_id = body['project_id']
            new_portfolio.user = User.objects.get(id=user_id)
            try:
                new_portfolio.save()
                for tag in body['tags']:
                    tag = str(tag)
                    create_tag(tag, new_portfolio.user)
                    new_portfolio.update(add_to_set__tags=SemanticTag.objects.get(wikidata_id=tag))
                    new_portfolio.user.update(add_to_set__tags=SemanticTag.objects.get(wikidata_id=tag))
                return JsonResponse({"response": True, "portfolio": portfolio_json(new_portfolio)})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e), "das": portfolio_json(new_portfolio)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})

    if request.method == 'PUT':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            user_id = authentication.get_user_id(token)
            try:
                portfolio = Portfolio.objects.get(id=body["portfolio_id"])
                if str(portfolio.user.id) == user_id:
                    portfolio = modify_portfolio(body, portfolio)
                    portfolio.save()
                    return JsonResponse({"response": True, "portfolio": portfolio_json(portfolio)})
                else:
                    return JsonResponse({'response': False, 'error': "Not allowed to edit this portfolio"})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})

    if request.method == 'GET':
        portfolio_id = request.GET.get('id', '')
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            try:
                portfolio = Portfolio.objects.get(id=portfolio_id)
                return JsonResponse({"response": True, "portfolio": portfolio_json(portfolio)})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})

    if request.method == 'DELETE':
        portfolio_id = request.GET.get('id', '')
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            try:
                portfolio = Portfolio.objects.get(id=portfolio_id)
                if str(portfolio.user.id) == user_id:
                    portfolio.delete()
                else:
                    return JsonResponse({'response': False, 'error': "Not allowed to delete this portfolio"})
                return JsonResponse({"response": True})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


@csrf_exempt
def wallet_handler(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if request.method == 'GET':
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            try:
                wallet = Wallet.objects.get(user=user_id)
                return JsonResponse({'response': True, 'wallet': wallet_json(wallet)})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    elif request.method == 'PUT':
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            body = json.loads(request.body.decode('utf-8'))
            try:
                wallet = Wallet.objects.get(user=user_id)
                wallet.balance += body['deposit'] if 'deposit' in body else 0
                wallet.balance -= body['withdraw'] if 'withdraw' in body else 0
                wallet.save()
                return JsonResponse({'response': True, 'wallet': wallet_json(wallet)})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    else:
        return JsonResponse({
            "response": False,
            "error": "wrong request method"
        })


@csrf_exempt
def message_handler(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if not (token and authentication.is_authenticated(token)):
        return JsonResponse({
            "response": False,
            "error": "Unauthorized"
        })
    requested_id = request.GET.get('id', None)
    requester = User.objects.get(id=authentication.get_user_id(token))
    if request.method == 'GET':
        if requested_id:
            if User.objects(id=requested_id):
                requested = User.objects.get(id=requested_id)
                conversation = Conversation.objects.filter(
                    ((Q(user1=requester) & Q(user2=requested)) | (Q(user1=requested) & Q(user2=requester))))[0]
                return JsonResponse({
                    "response": True,
                    "conversation": conversation_json(conversation)
                })
            else:
                return JsonResponse({
                    "response": False,
                    "error": "wrong user id"
                })
        else:
            conversations = Conversation.objects.filter((Q(user1=requester) | Q(user2=requester)))
            ret = []
            for conversation in conversations:
                ret.append(conversation_json(conversation))
            return JsonResponse({
                "response": True,
                "conversations": ret
            })
    elif request.method == 'POST':
        if not requested_id:
            return JsonResponse({
                "response": False,
                "error": "Provide a user id"
            })
        message = request.GET.get('message', None)
        if not message:
            return JsonResponse({
                "response": False,
                "error": "There is no message"
            })
        requested = User.objects.get(id=requested_id)
        conversation = Conversation.objects.filter(
            ((Q(user1=requester) & Q(user2=requested)) | (Q(user1=requested) & Q(user2=requester))) )
        if not conversation:
            conversation = Conversation()
            conversation.user1 = requester
            conversation.user2 = requested
            conversation.messages = []
            conversation.save()
        else:
            conversation = conversation[0]
        new_message = Message()
        new_message.body = message
        new_message.sender = requester
        new_message.receiver = requested
        new_message.save()
        conversation.messages.append(new_message)
        conversation.save()
        return JsonResponse({
            "response": True
        })
    else:
        return JsonResponse({
            "response": False,
            "error": "wrong request method"
        })

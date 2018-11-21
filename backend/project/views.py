from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from user import authentication, models, views
from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist
from api.utils import *

import json
from .models import Project, Bid


def modify_project(json, project):
    project.title = json['title'] if 'title' in json else project.title
    project.budget = json['budget'] if 'budget' in json else project.budget
    project.description = json['description'] if 'description' in json else project.description
    project.project_deadline = json['project_deadline'] if 'project_deadline' in json else project.project_deadline
    project.freelancer_id = models.User.objects.get(id=json['freelancer_id']) if 'freelancer_id' in json\
        else project.freelancer_id
    project.status = json['status'] if 'status' in json else project.status
    project.updated_at = datetime.now()
    return project


@csrf_exempt
def create_project(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            body = json.loads(request.body.decode('utf-8'))
            new_project = Project()
            try:
                new_project.owner_id = models.User.objects.get(id=authentication.get_user_id(token))
                new_project.freelancer = None
                new_project.description = body['description']
                new_project.title = body['title']
                new_project.budget = body['budget']
                new_project.project_deadline = body['project_deadline']
                new_project.status = 0  # default
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
            new_project.save()
            return JsonResponse({"response": True, "project": project_json(new_project,user_id)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


@csrf_exempt
def get_own_projects(request):
    if request.method == 'GET':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            freelancer_projects = Project.objects. \
                filter(freelancer_id=user_id)
            owner_projects = Project.objects. \
                filter(owner_id=user_id)
            freelancer_projects_json = []
            owner_projects_json = []
            for project in freelancer_projects:
                freelancer_projects_json.append(project_json(project,user_id))
            for project in owner_projects:
                owner_projects_json.append(project_json(project,user_id))
            res = {'freelancer':freelancer_projects_json, 'client': owner_projects_json}
            try:
                return JsonResponse({"response": True, "projects": res})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


# return all projects
@csrf_exempt
def get_all_projects(request):
    if request.method == 'GET':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            projects = Project.objects.filter(status__gte = 0) # excludes discarded projects
            res = []
            for project in projects:
                res.append(project_json(project,user_id))
            try:
                return JsonResponse({"response": True, "projects": res})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })

@csrf_exempt
def search_projects(request, query):
    if request.method == 'GET':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            projects = Project.objects.search_text(query).filter(status__gte = 0)\
                .order_by('$text_score')  # excludes discarded projects
            res = []
            for project in projects:
                res.append(project_json(project,user_id))
            try:
                return JsonResponse({"response": True, "projects": res})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


@csrf_exempt
def get_projects(request, ids):
    if request.method == 'GET':
        ids = ids.split(',')
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            projects = Project.objects.filter(id__in=ids) # TODO: order as given id list
            res = []
            for project in projects:
                res.append(project_json(project,user_id))
            try:
                return JsonResponse({"response": True, "projects": res})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


# TODO:
@csrf_exempt
def update_project(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            body = json.loads(request.body.decode('utf-8'))
            project = Project.objects.get(id=body['project_id'])
            modify_project(body, project)
            try:
                project.save()
                return JsonResponse({"response": True, "project": project_json(project,user_id)})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


@csrf_exempt
def discard_projects(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            projects = Project.objects.filter(id__in=body['project_ids'])
            try:
                projects.update(status=-1)
                return JsonResponse({'response': True})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


@csrf_exempt
def add_bid(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            new_bid = Bid()
            try:
                new_bid.project = Project.objects.get(id=body['project_id'])
                new_bid.freelancer = models.User.objects.get(id=body['freelancer_id'])
                new_bid.offer = body['offer']
                new_bid.note = body['note']
                new_bid.save()
                return JsonResponse({'response': True})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


@csrf_exempt
def accept_bid(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            try:
                user_id = authentication.get_user_id(token)
                bid = Bid.objects.get(id=body['bid_id'])
                if user_id != str(bid.project.owner_id.id):
                    return JsonResponse({'response': False, 'error': "Only owner of the project can accept a bid"})
                other_bids = Bid.objects.filter(project=bid.project)
                other_bids.update(status=2, updated_at=datetime.now)
                bid.update(status=1, updated_at=datetime.now)
                bid.project.freelancer_id = bid.freelancer
                bid.project.status = 1
                bid.project.save()
                return JsonResponse({'response': True})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


@csrf_exempt
def discard_bid(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            try:
                bid = Bid.objects.get(id=body['bid_id'])
                bid.update(status=-1, updated_at=datetime.now)
                return JsonResponse({'response': True})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


# Get bids of a given project
@csrf_exempt
def get_bids(request, project_id):
    if request.method == 'GET':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            user_id = authentication.get_user_id(token)
            bids = Bid.objects.filter(status__gte = 0, project=Project.objects.get(id=project_id)) # excludes discarded projects
            res = []
            for bid in bids:
                res.append(bid_json(bid, user_id))
            try:
                return JsonResponse({"response": True, "project_id": project_id, "bids": res})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })

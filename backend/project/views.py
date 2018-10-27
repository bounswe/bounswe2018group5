from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import authentication
import json
from .models import Project, DoesNotExist


def create_project(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            new_project = Project()
            try:
                new_project.owner_id = int(token['id'])
                new_project.freelancer_id = None
                new_project.description = body['description']
                new_project.title = body['title']
                new_project.budget = body['budget']
                new_project.project_deadline = body['project_deadline']
                new_project.status = 0  # default
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
            new_project.save()
            return JsonResponse({"response": True})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


# return all projects
def get_projects(request):
    if request.method == 'GET':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            projects = Project.objects.get()
            try:
                return JsonResponse({"response": True, "projects": projects})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


def get_project(request):
    if request.method == 'GET':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            project = Project.objects.get(id=body['project_id'])
            try:
                return JsonResponse({"response": True, "project": project})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


def update_project(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            project = Project.objects.get(id=body['project_id'])
            try:
                success = project.modify(update=body)
                return JsonResponse({'response': success})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })


def delete_project(request):
    if request.method == 'GET':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            project = Project.objects.get(id=body['project_id'])
            try:
                success = project.delete()
                return JsonResponse({'response': success})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
    return JsonResponse({
        "response": False,
        "error": "wrong request method"
    })

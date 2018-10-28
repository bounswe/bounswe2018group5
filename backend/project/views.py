from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from user import authentication
import json
from .models import Project, DoesNotExist

def project_json(project):
    obj = {}
    obj['project_id'] = str(project.id)
    obj['title'] = project.title
    obj['budget'] = project.budget
    obj['description'] = project.description
    obj['deadline'] = project.project_deadline
    obj['created_at'] = project.created_at
    obj['updated_at'] = project.updated_at
    obj['owner_id'] = project.owner_id
    obj['status'] = project.status
    return obj

@csrf_exempt
def create_project(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            new_project = Project()
            try:
                new_project.owner_id = authentication.get_user_id(token)
                new_project.freelancer_id = None
                new_project.description = body['description']
                new_project.title = body['title']
                new_project.budget = body['budget']
                new_project.project_deadline = body['project_deadline']
                new_project.status = 0  # default
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
            new_project.save()
            return JsonResponse({"response": True, "project": project_json(new_project)})
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
            projects = Project.objects.filter(status__gte = 0) # excludes discarded projects
            res = []
            for project in projects:
                res.append(project_json(project))
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
def get_projects(request):
    if request.method == 'POST':
        token = request.META.get('HTTP_AUTHORIZATION', None)
        if token and authentication.is_authenticated(token):
            body = json.loads(request.body.decode('utf-8'))
            projects = Project.objects.filter(id__in=body['project_ids']) # TODO: order as given id list
            res = []
            for project in projects:
                res.append(project_json(project))
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
            body = json.loads(request.body.decode('utf-8'))
            project = Project.objects.get(id=body['project_id'])
            try:
                success = project.modify(update=body)
                return JsonResponse({'response': success})
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

from django.views.decorators.csrf import csrf_exempt
from user import authentication
from django.http import JsonResponse
from . import utils
from user.models import *
from project.models import *


def find_freelancers(project):
    temp = []
    for user in User.objects:
        if project.owner == user:
            continue
        match_score = 0.0
        for project_tag in project.tags:
            for user_tag in user.tags:
                if TagRelation.objects(tag1=project_tag, tag2=user_tag):
                    relation = TagRelation.objects.get(tag1=project_tag, tag2=user_tag)
                else:
                    relation = TagRelation.objects.get(tag1=user_tag, tag2=project_tag)
                match_score += relation.value
        temp.append([match_score, user])
    temp.sort(key=lambda tup: tup[0])
    temp.reverse()
    if len(temp) == 0:
        return temp
    ret = []
    for score, user in temp:
        ret.append(utils.user_json(user))
    return ret


def find_projects(user, requester):
    temp = []
    for project in Project.objects:
        if project.owner == user:
            continue
        match_score = 0.0
        for project_tag in project.tags:
            for user_tag in user.tags:
                if TagRelation.objects(tag1=project_tag, tag2=user_tag):
                    relation = TagRelation.objects.get(tag1=project_tag, tag2=user_tag)
                else:
                    relation = TagRelation.objects.get(tag1=user_tag, tag2=project_tag)
                match_score += relation.value
        temp.append([match_score, project])
    temp.sort(key=lambda tup: tup[0])
    temp.reverse()
    if len(temp) == 0:
        return temp
    ret = []
    for score, project in temp:
        ret.append(utils.project_json(project, requester))
    return ret


@csrf_exempt
def recommend(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if not (token and authentication.is_authenticated(token)):
        return JsonResponse({
            "response": False,
            "error": "Unauthorized"
        })
    recommend_id = request.GET.get('id', None)
    if not recommend_id:
        recommend_id = authentication.get_user_id(token)
    if Project.objects(id=recommend_id):
        ret = find_freelancers(Project.objects.get(id=recommend_id))
    elif User.objects(id=recommend_id):
        ret = find_projects(User.objects.get(id=recommend_id), authentication.get_user_id(token))
    else:
        return JsonResponse({
            "response": False,
            "error": "No matching id"
        })
    return JsonResponse({
        "response": True,
        "recommendation": ret
    })
